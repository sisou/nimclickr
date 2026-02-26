<script setup lang="ts">
import { ref } from 'vue'
import { useGameLoop } from './composables/useGameLoop'
import TpsDisplay from './components/TpsDisplay.vue'
import ClickButton from './components/ClickButton.vue'
import BuildingList from './components/BuildingList.vue'
import UpgradeList from './components/UpgradeList.vue'
import TabBar from './components/TabBar.vue'
import { useGameStore } from './stores/game'

useGameLoop()

const store = useGameStore()
const activeTab = ref<'buildings' | 'upgrades'>('buildings')

function confirmReset() {
  if (confirm('Reset all progress? This cannot be undone.')) store.resetGame()
}
</script>

<template>
  <div class="app">
    <!-- Scrolling background pattern -->
    <div class="bg-pattern" aria-hidden="true" />

    <div class="game-shell">
      <!-- Header -->
      <header class="header">
        <h1 class="logo">⛓ NimClickr</h1>
        <button class="reset-btn" @click="confirmReset" title="Reset game">↺</button>
      </header>

      <!-- Stats -->
      <TpsDisplay />

      <!-- Tap button -->
      <ClickButton />

      <!-- Shop tabs -->
      <TabBar v-model="activeTab" />

      <!-- Shop panel -->
      <div class="shop-panel">
        <BuildingList v-if="activeTab === 'buildings'" />
        <UpgradeList v-else />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow-x: hidden;
}

.bg-pattern {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 24px,
      #ffffff03 24px,
      #ffffff03 25px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 24px,
      #ffffff03 24px,
      #ffffff03 25px
    );
  animation: bg-scroll 20s linear infinite;
}

@keyframes bg-scroll {
  from { background-position: 0 0; }
  to { background-position: 25px 25px; }
}

.game-shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 0 0.9rem;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0 0;
}

.logo {
  font-size: 1.15rem;
  font-weight: 900;
  color: #00f5ff;
  text-shadow: 0 0 12px #00f5ff55;
  letter-spacing: 0.04em;
  margin: 0;
}

.reset-btn {
  background: none;
  border: 1px solid #222244;
  border-radius: 6px;
  color: #444466;
  font-size: 1rem;
  padding: 0.2rem 0.5rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  font-family: inherit;
}

.reset-btn:hover {
  color: #ff6666;
  border-color: #ff666644;
}

.shop-panel {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 1.5rem;
}
</style>
