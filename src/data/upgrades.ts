import type { BuildingId, UpgradeDef, UpgradeId } from '../types'
import { BUILDINGS } from './buildings'

const BUILDING_UNLOCK_STEPS: number[] = [8, 16, 32, 64, 128, 256, 512, 1024, 2048]

/** Cost multiplier per building upgrade step (relative to base building cost) */
const BUILDING_UPGRADE_COST_MULTIPLIERS: number[] = [10, 50, 150, 500, 1_500, 5_000, 15_000, 50_000, 150_000]

function buildingUpgrades(): UpgradeDef[] {
  const upgrades: UpgradeDef[] = []

  for (const building of BUILDINGS) {
    for (let step = 1; step <= 9; step++) {
      const id = `${building.id}_${step}` as UpgradeId
      const requiredOwned = BUILDING_UNLOCK_STEPS[step - 1]
      const cost = Math.floor(building.baseCost * BUILDING_UPGRADE_COST_MULTIPLIERS[step - 1])

      upgrades.push({
        id,
        name: `${building.name} Lv.${step}`,
        description: `${building.name} TPS ×2`,
        cost,
        buildingId: building.id as BuildingId,
        multiplier: 2,
        unlockCondition: {
          type: 'owned',
          buildingId: building.id as BuildingId,
          count: requiredOwned,
        },
      })
    }
  }

  return upgrades
}

const CLICK_UNLOCK_TPS: number[] = [100, 1_000, 10_000, 100_000, 1_000_000]
const CLICK_UPGRADE_COSTS: number[] = [500, 5_000, 50_000, 500_000, 5_000_000]

function clickUpgrades(): UpgradeDef[] {
  return CLICK_UNLOCK_TPS.map((tpsThreshold, i) => ({
    id: `click_${i + 1}` as UpgradeId,
    name: `Click Power Lv.${i + 1}`,
    description: `Click power ×1.25 (requires ${tpsThreshold.toLocaleString()} TPS)`,
    cost: CLICK_UPGRADE_COSTS[i],
    buildingId: null,
    multiplier: 1.25,
    unlockCondition: { type: 'tps' as const, value: tpsThreshold },
  }))
}

export const UPGRADES: UpgradeDef[] = [...buildingUpgrades(), ...clickUpgrades()]
