<script setup vapor lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'

type Tab = 'buildings' | 'upgrades'

defineProps<{ modelValue: Tab }>()
const emit = defineEmits<{ 'update:modelValue': [tab: Tab] }>()

const store = useGameStore()

const upgradeCount = computed(() => store.availableUpgrades.length)
</script>

<template>
  <div class="tab-bar" role="tablist">
    <button
      class="tab"
      :class="{ active: modelValue === 'buildings' }"
      role="tab"
      :aria-selected="modelValue === 'buildings'"
      @click="emit('update:modelValue', 'buildings')"
    >
      Buildings
    </button>
    <button
      class="tab"
      :class="{ active: modelValue === 'upgrades' }"
      role="tab"
      :aria-selected="modelValue === 'upgrades'"
      @click="emit('update:modelValue', 'upgrades')"
    >
      Upgrades
      <span v-if="upgradeCount > 0" class="badge">{{ upgradeCount }}</span>
    </button>
  </div>
</template>

<style scoped>
.tab-bar {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.tab {
  flex: 1;
  padding: 0.55rem 0;
  border-radius: 8px;
  border: 1px solid #1a1a2e;
  background: #0d0d1a;
  color: #555577;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s,
    box-shadow 0.15s,
    background 0.15s;
  position: relative;
}

.tab.active {
  color: #00f5ff;
  border-color: #00f5ff55;
  background: #002d3366;
  box-shadow: 0 0 10px #00f5ff22;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.2em;
  height: 1.2em;
  padding: 0 0.3em;
  border-radius: 999px;
  background: #bf5af2;
  color: #fff;
  font-size: 0.65em;
  font-weight: 900;
  margin-left: 0.35rem;
  vertical-align: middle;
  box-shadow: 0 0 6px #bf5af266;
}
</style>
