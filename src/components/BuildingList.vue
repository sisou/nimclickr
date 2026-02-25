<script setup lang="ts">
import { computed } from 'vue'
import { BUILDINGS, buildingCost } from '../data/buildings'
import { useGameStore } from '../stores/game'
import { formatNum } from '../composables/useNumberFormat'
import type { BuildingId } from '../types'

const store = useGameStore()

const rows = computed(() =>
  BUILDINGS.filter((b) => store.totalTransactions >= b.baseCost * 0.5 || store.buildings[b.id].owned > 0)
    .map((b) => {
      const owned = store.buildings[b.id].owned
      const cost = buildingCost(b.baseCost, owned)
      const canAfford = store.transactions >= cost
      const tpsContrib = owned * b.baseTps * store.buildingMultipliers[b.id]
      return { ...b, owned, cost, canAfford, tpsContrib }
    }),
)

function buy(id: BuildingId) {
  store.buyBuilding(id)
}
</script>

<template>
  <div class="building-list">
    <button
      v-for="row in rows"
      :key="row.id"
      class="building-row"
      :class="{ affordable: row.canAfford, owned: row.owned > 0 }"
      :disabled="!row.canAfford"
      @click="buy(row.id)"
      :aria-label="`Buy ${row.name} for ${formatNum(row.cost)} transactions`"
    >
      <span class="building-owned">{{ row.owned }}</span>
      <span class="building-emoji">{{ row.emoji }}</span>
      <div class="building-info">
        <span class="building-name">{{ row.name }}</span>
        <span class="building-tps" v-if="row.owned > 0">
          {{ formatNum(row.tpsContrib, 10) }} TPS
        </span>
        <span class="building-desc" v-else>{{ row.description }}</span>
      </div>
      <span class="building-cost">{{ formatNum(row.cost) }}</span>
    </button>
  </div>
</template>

<style scoped>
.building-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.building-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid #1a1a2e;
  background: #0d0d1a;
  font-family: inherit;
  text-align: left;
  cursor: not-allowed;
  width: 100%;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background 0.15s;
  opacity: 0.6;
}

.building-row.owned {
  opacity: 0.85;
  border-color: #1e1e3a;
}

.building-row.affordable {
  opacity: 1;
  border-color: #00f5ff44;
  box-shadow: 0 0 8px #00f5ff11;
  cursor: pointer;
}

.building-row.affordable:active {
  background: #00233399;
  box-shadow: 0 0 16px #00f5ff33;
}

.building-owned {
  font-size: 1.15rem;
  font-weight: 900;
  color: #bf5af2;
  min-width: 2rem;
  text-align: center;
  flex-shrink: 0;
  text-shadow: 0 0 8px #bf5af255;
}

.building-emoji {
  font-size: 1.4rem;
  width: 1.8rem;
  text-align: center;
  flex-shrink: 0;
}

.building-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.building-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #c8c8e8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.building-tps {
  font-size: 0.72rem;
  color: #00f5ff;
  opacity: 0.8;
}

.building-desc {
  font-size: 0.7rem;
  color: #555577;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.building-cost {
  font-size: 0.85rem;
  font-weight: 700;
  color: #666688;
  flex-shrink: 0;
  white-space: nowrap;
}

.building-row.affordable .building-cost {
  color: #00f5ff;
  text-shadow: 0 0 8px #00f5ff55;
}
</style>
