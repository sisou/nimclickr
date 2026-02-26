import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { BUILDINGS, buildingCost } from '../data/buildings'
import { UPGRADES } from '../data/upgrades'
import type { BuildingId, BuildingState, SavedGameState, UpgradeId, UpgradeState } from '../types'

const SAVE_KEY = 'nimclickr_save'

function defaultBuildings(): Record<BuildingId, BuildingState> {
  return Object.fromEntries(BUILDINGS.map((b) => [b.id, { owned: 0 }])) as Record<
    BuildingId,
    BuildingState
  >
}

function defaultUpgrades(): Record<UpgradeId, UpgradeState> {
  return Object.fromEntries(UPGRADES.map((u) => [u.id, { purchased: false }])) as Record<
    UpgradeId,
    UpgradeState
  >
}

export const useGameStore = defineStore('game', () => {
  // --- State ---
  const transactions = ref(0)
  const totalTransactions = ref(0)
  const buildings = ref<Record<BuildingId, BuildingState>>(defaultBuildings())
  const upgrades = ref<Record<UpgradeId, UpgradeState>>(defaultUpgrades())

  // --- Computed ---

  /** Multiplier applied to each building's TPS from purchased upgrades */
  const buildingMultipliers = computed<Record<BuildingId, number>>(() => {
    const mults = Object.fromEntries(BUILDINGS.map((b) => [b.id, 1])) as Record<BuildingId, number>

    for (const upgrade of UPGRADES) {
      if (upgrade.buildingId && upgrades.value[upgrade.id].purchased) {
        mults[upgrade.buildingId] *= upgrade.multiplier
      }
    }

    return mults
  })

  /** Total passive transactions per second */
  const tps = computed<number>(() => {
    let total = 0
    for (const building of BUILDINGS) {
      const owned = buildings.value[building.id].owned
      if (owned > 0) {
        total += owned * building.baseTps * buildingMultipliers.value[building.id]
      }
    }
    return total
  })

  /** Transactions earned per click — at least 1, scales with TPS (×click upgrades) */
  const clickPower = computed<number>(() => {
    let multiplier = 1
    for (const upgrade of UPGRADES) {
      if (upgrade.buildingId === null && upgrades.value[upgrade.id].purchased) {
        multiplier *= upgrade.multiplier
      }
    }
    return Math.max(1, tps.value * 0.5) * multiplier
  })

  /** Upgrades that have been unlocked (condition met) but not yet purchased */
  const availableUpgrades = computed(() => {
    return UPGRADES.filter((upgrade) => {
      if (upgrades.value[upgrade.id].purchased) return false

      const cond = upgrade.unlockCondition
      if (cond.type === 'owned') {
        return buildings.value[cond.buildingId].owned >= cond.count
      } else {
        return tps.value >= cond.value
      }
    })
  })

  // --- Actions ---

  function clickTransaction() {
    transactions.value += clickPower.value
    totalTransactions.value += clickPower.value
  }

  function buyBuilding(id: BuildingId) {
    const def = BUILDINGS.find((b) => b.id === id)
    if (!def) return

    const cost = buildingCost(def.baseCost, buildings.value[id].owned)
    if (transactions.value < cost) return

    transactions.value -= cost
    buildings.value[id].owned++
  }

  function buyUpgrade(id: UpgradeId) {
    const def = UPGRADES.find((u) => u.id === id)
    if (!def) return
    if (upgrades.value[id].purchased) return
    if (transactions.value < def.cost) return

    transactions.value -= def.cost
    upgrades.value[id].purchased = true
  }

  function tick(delta: number) {
    const earned = tps.value * delta
    transactions.value += earned
    totalTransactions.value += earned
  }

  function saveGame() {
    const state: SavedGameState = {
      transactions: transactions.value,
      totalTransactions: totalTransactions.value,
      buildings: buildings.value,
      upgrades: upgrades.value,
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  }

  function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) return

    try {
      const saved = JSON.parse(raw) as Partial<SavedGameState>

      if (typeof saved.transactions === 'number') transactions.value = saved.transactions
      if (typeof saved.totalTransactions === 'number')
        totalTransactions.value = saved.totalTransactions

      if (saved.buildings) {
        for (const id of Object.keys(saved.buildings) as BuildingId[]) {
          if (buildings.value[id] !== undefined) {
            buildings.value[id].owned = saved.buildings[id].owned ?? 0
          }
        }
      }

      if (saved.upgrades) {
        for (const id of Object.keys(saved.upgrades) as UpgradeId[]) {
          if (upgrades.value[id] !== undefined) {
            upgrades.value[id].purchased = saved.upgrades[id].purchased ?? false
          }
        }
      }
    } catch {
      // Corrupt save — start fresh
      console.warn('NimClickr: corrupt save data, starting fresh')
    }
  }

  function resetGame() {
    transactions.value = 0
    totalTransactions.value = 0
    buildings.value = defaultBuildings()
    upgrades.value = defaultUpgrades()
    localStorage.removeItem(SAVE_KEY)
  }

  return {
    // State
    transactions,
    totalTransactions,
    buildings,
    upgrades,
    // Computed
    tps,
    clickPower,
    buildingMultipliers,
    availableUpgrades,
    // Actions
    clickTransaction,
    buyBuilding,
    buyUpgrade,
    tick,
    saveGame,
    loadGame,
    resetGame,
  }
})
