<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/game'
import { formatNum } from '../composables/useNumberFormat'

const store = useGameStore()

const tpsDisplay = computed(() => formatNum(store.tps))
const totalDisplay = computed(() => formatNum(store.totalTransactions))
const balanceDisplay = computed(() => formatNum(store.transactions))
const clickDisplay = computed(() => formatNum(store.clickPower))
</script>

<template>
  <div class="tps-display">
    <div class="tps-value">{{ tpsDisplay }} <span class="tps-label">TPS</span></div>
    <div class="tx-balance">⬡ {{ balanceDisplay }} tx</div>
    <div class="tx-total">Total earned: {{ totalDisplay }} tx</div>
    <div class="click-info">+{{ clickDisplay }} per tap</div>
  </div>
</template>

<style scoped>
.tps-display {
  text-align: center;
  padding: 1rem 0 0.5rem;
}

.tps-value {
  font-size: clamp(2.5rem, 10vw, 4rem);
  font-weight: 900;
  color: #00f5ff;
  text-shadow:
    0 0 10px #00f5ff,
    0 0 30px #00f5ff,
    0 0 60px #00f5ff44;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.tps-label {
  font-size: 0.45em;
  color: #bf5af2;
  text-shadow:
    0 0 8px #bf5af2,
    0 0 20px #bf5af244;
  vertical-align: middle;
  margin-left: 0.25rem;
}

.tx-balance {
  font-size: clamp(1.1rem, 4vw, 1.4rem);
  color: #e0e0ff;
  margin-top: 0.3rem;
  font-weight: 600;
}

.tx-total {
  font-size: 0.8rem;
  color: #666899;
  margin-top: 0.15rem;
}

.click-info {
  font-size: 0.75rem;
  color: #bf5af2;
  margin-top: 0.3rem;
  opacity: 0.8;
}
</style>
