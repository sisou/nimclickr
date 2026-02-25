<script setup lang="ts">
import { computed } from 'vue'
import { BUILDINGS, buildingCost } from '../data/buildings'
import { useGameStore } from '../stores/game'
import { formatNum } from '../composables/useNumberFormat'
import type { BuildingId } from '../types'

const store = useGameStore()

const rows = computed(() =>
  BUILDINGS.map((b) => {
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
    <div
      v-for="row in rows"
      :key="row.id"
      class="building-row"
      :class="{ affordable: row.canAfford, owned: row.owned > 0 }"
    >
      <span class="building-emoji">{{ row.emoji }}</span>
      <div class="building-info">
        <span class="building-name">{{ row.name }}</span>
        <span class="building-tps" v-if="row.owned > 0">
          {{ formatNum(row.tpsContrib) }} TPS
        </span>
        <span class="building-desc" v-else>{{ row.description }}</span>
      </div>
      <div class="building-right">
        <span class="building-owned">×{{ row.owned }}</span>
        <button
          class="buy-btn"
          :class="{ affordable: row.canAfford }"
          :disabled="!row.canAfford"
          @click="buy(row.id)"
          :aria-label="`Buy ${row.name} for ${formatNum(row.cost)} transactions`"
        >
          {{ formatNum(row.cost) }}
        </button>
      </div>
    </div>
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
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
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

.building-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  flex-shrink: 0;
}

.building-owned {
  font-size: 0.75rem;
  color: #bf5af2;
  font-weight: 700;
  min-width: 2rem;
  text-align: right;
}

.buy-btn {
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #333355;
  background: #111122;
  color: #666688;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: inherit;
  cursor: not-allowed;
  white-space: nowrap;
  min-width: 54px;
  text-align: center;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s,
    box-shadow 0.15s;
}

.buy-btn.affordable {
  border-color: #00f5ff88;
  background: #002d3399;
  color: #00f5ff;
  cursor: pointer;
  box-shadow: 0 0 8px #00f5ff33;
}

.buy-btn.affordable:active {
  background: #00f5ff22;
  box-shadow: 0 0 16px #00f5ff55;
}
</style>
