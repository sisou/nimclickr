<script setup lang="ts">
import { computed } from 'vue'
import { BUILDINGS } from '../data/buildings'
import { useGameStore } from '../stores/game'
import { formatNum } from '../composables/useNumberFormat'
import type { UpgradeId } from '../types'

const store = useGameStore()

const buildingEmoji = Object.fromEntries(BUILDINGS.map((b) => [b.id, b.emoji]))

const rows = computed(() =>
  store.availableUpgrades.map((u) => ({
    ...u,
    emoji: u.buildingId ? (buildingEmoji[u.buildingId] ?? '⚡') : '👆',
    canAfford: store.transactions >= u.cost,
  })),
)

function buy(id: UpgradeId) {
  store.buyUpgrade(id)
}
</script>

<template>
  <div class="upgrade-list">
    <p v-if="rows.length === 0" class="no-upgrades">
      Keep transacting to unlock upgrades…
    </p>

    <div
      v-for="row in rows"
      :key="row.id"
      class="upgrade-row"
      :class="{ affordable: row.canAfford }"
    >
      <span class="upgrade-emoji">{{ row.emoji }}</span>
      <div class="upgrade-info">
        <span class="upgrade-name">{{ row.name }}</span>
        <span class="upgrade-desc">{{ row.description }}</span>
      </div>
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
</template>

<style scoped>
.upgrade-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.no-upgrades {
  text-align: center;
  color: #444466;
  font-size: 0.85rem;
  padding: 2rem 1rem;
}

.upgrade-row {
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
}

.upgrade-row.affordable {
  border-color: #bf5af244;
  box-shadow: 0 0 8px #bf5af211;
}

.upgrade-emoji {
  font-size: 1.3rem;
  width: 1.8rem;
  text-align: center;
  flex-shrink: 0;
}

.upgrade-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.upgrade-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #c8c8e8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upgrade-desc {
  font-size: 0.68rem;
  color: #555577;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  flex-shrink: 0;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s,
    box-shadow 0.15s;
}

.buy-btn.affordable {
  border-color: #bf5af288;
  background: #1a0033aa;
  color: #bf5af2;
  cursor: pointer;
  box-shadow: 0 0 8px #bf5af233;
}

.buy-btn.affordable:active {
  background: #bf5af222;
  box-shadow: 0 0 16px #bf5af255;
}
</style>
