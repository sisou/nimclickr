<script setup vapor lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()

interface Particle {
  id: number
  x: number
  y: number
}

const particles = ref<Particle[]>([])
let nextId = 0

function handleClick(event: MouseEvent | TouchEvent) {
  store.clickTransaction()
  spawnParticles(event)
}

function spawnParticles(event: MouseEvent | TouchEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  let clientX: number, clientY: number

  if (event instanceof TouchEvent) {
    const touch = event.touches[0] ?? event.changedTouches[0]
    clientX = touch.clientX
    clientY = touch.clientY
  } else {
    clientX = event.clientX
    clientY = event.clientY
  }

  const x = ((clientX - rect.left) / rect.width) * 100
  const y = ((clientY - rect.top) / rect.height) * 100

  const count = 8
  for (let i = 0; i < count; i++) {
    const id = nextId++
    particles.value.push({ id, x, y })
    setTimeout(() => {
      particles.value = particles.value.filter((p) => p.id !== id)
    }, 700)
  }
}
</script>

<template>
  <div class="click-area" @click="handleClick" @touchstart.prevent="handleClick">
    <button class="sign-btn" type="button" aria-label="Sign Transaction">
      <span class="btn-icon">⛓</span>
      <span class="btn-text">SIGN TX</span>
    </button>

    <div
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="{ left: p.x + '%', top: p.y + '%' }"
    />
  </div>
</template>

<style scoped>
.click-area {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  overflow: hidden;
}

.sign-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: clamp(140px, 45vw, 180px);
  height: clamp(140px, 45vw, 180px);
  border-radius: 50%;
  border: 3px solid #00f5ff;
  background: radial-gradient(circle at 40% 35%, #0d2d3d, #05151f);
  box-shadow:
    0 0 20px #00f5ff55,
    0 0 50px #00f5ff22,
    inset 0 0 20px #00f5ff11;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    box-shadow 0.1s,
    transform 0.08s;
  outline: none;
  color: #00f5ff;
}

.sign-btn:active {
  transform: scale(0.94);
  box-shadow:
    0 0 40px #00f5ffaa,
    0 0 80px #00f5ff44,
    inset 0 0 30px #00f5ff22;
}

.btn-icon {
  font-size: 2.2rem;
  line-height: 1;
  margin-bottom: 0.3rem;
}

.btn-text {
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-shadow:
    0 0 8px #00f5ff,
    0 0 20px #00f5ff55;
}

/* Particle burst */
.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00f5ff;
  box-shadow: 0 0 6px #00f5ff;
  pointer-events: none;
  animation: particle-burst 0.7s ease-out forwards;
  transform: translate(-50%, -50%);
}

.particle:nth-child(8n + 1) { --dx: -60px; --dy: -70px; animation-delay: 0ms; }
.particle:nth-child(8n + 2) { --dx: 60px;  --dy: -70px; animation-delay: 20ms; background: #bf5af2; box-shadow: 0 0 6px #bf5af2; }
.particle:nth-child(8n + 3) { --dx: -80px; --dy: 0px;   animation-delay: 40ms; }
.particle:nth-child(8n + 4) { --dx: 80px;  --dy: 0px;   animation-delay: 60ms; background: #bf5af2; box-shadow: 0 0 6px #bf5af2; }
.particle:nth-child(8n + 5) { --dx: -60px; --dy: 70px;  animation-delay: 0ms; }
.particle:nth-child(8n + 6) { --dx: 60px;  --dy: 70px;  animation-delay: 20ms; background: #bf5af2; box-shadow: 0 0 6px #bf5af2; }
.particle:nth-child(8n + 7) { --dx: 0px;   --dy: -85px; animation-delay: 40ms; }
.particle:nth-child(8n + 0) { --dx: 0px;   --dy: 85px;  animation-delay: 60ms; background: #bf5af2; box-shadow: 0 0 6px #bf5af2; }

@keyframes particle-burst {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--dx, 0px)), calc(-50% + var(--dy, 0px))) scale(0);
    opacity: 0;
  }
}
</style>
