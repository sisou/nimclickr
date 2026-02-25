import { onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/game'

const TICK_INTERVAL = 100 // ms
const SAVE_INTERVAL = 10_000 // ms

export function useGameLoop() {
  const store = useGameStore()

  let tickTimer: ReturnType<typeof setInterval>
  let saveTimer: ReturnType<typeof setInterval>

  function handleBeforeUnload() {
    store.saveGame()
  }

  onMounted(() => {
    store.loadGame()

    tickTimer = setInterval(() => {
      store.tick(TICK_INTERVAL / 1000)
    }, TICK_INTERVAL)

    saveTimer = setInterval(() => {
      store.saveGame()
    }, SAVE_INTERVAL)

    window.addEventListener('beforeunload', handleBeforeUnload)
  })

  onUnmounted(() => {
    clearInterval(tickTimer)
    clearInterval(saveTimer)
    window.removeEventListener('beforeunload', handleBeforeUnload)
  })
}
