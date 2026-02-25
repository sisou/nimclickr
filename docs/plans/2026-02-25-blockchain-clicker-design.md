# NimClickr — Blockchain Clicker Game
## Design Document
_Date: 2026-02-25_

---

## Context

Building a mobile-optimized browser clicker/idle game with a blockchain theme. The player increases their **transactions per second (TPS)** by tapping a "Sign Transaction" button and spending accumulated transactions on passive buildings and upgrades. No server component — pure frontend with localStorage persistence.

Stack: Vue 3 + Pinia + Vite + TypeScript, pure CSS (cyberpunk/neon aesthetic).

---

## Game Design

### Core Loop
- Tap "Sign Transaction" → earn transactions (currency)
- Spend transactions on buildings → buildings passively generate TPS
- Higher TPS → earn transactions faster → buy more buildings/upgrades
- Main display metric: current TPS (large, prominent)

### Buildings
| ID          | Name          | Base cost | TPS/unit |
|-------------|---------------|-----------|----------|
| wallet      | Wallet        | 10 tx     | 0.1      |
| dapp        | DApp          | 100 tx    | 1        |
| validator   | Validator Node| 1,000 tx  | 10       |
| mining_pool | Mining Pool   | 10,000 tx | 100      |

Cost scaling: `baseCost * 1.15^owned` (standard idle game curve)

### Upgrades (~14 total)
- 3 per building, unlocked at 1/5/25 owned: 2x / 5x / 10x multiplier on that building
- 2 click-power upgrades: unlocked at 50 TPS (2x click) and 500 TPS (5x click)

---

## UI Layout (mobile-first, single screen)

```
┌─────────────────────────────┐
│  ⛓ NimClickr               │
│                             │
│    ████ 1,337 TPS ████      │  ← large glowing TPS counter
│    Total: 4.2M txs          │
│                             │
│  ┌──────────────────────┐   │
│  │   [ SIGN TX ]        │   │  ← big tap button, ripple on tap
│  │   +12 per tap        │   │
│  └──────────────────────┘   │
│                             │
│  [ Buildings ] [ Upgrades ] │  ← tab switcher
│  ┌──────────────────────┐   │
│  │ 🔑 Wallet  ×14  Buy  │   │
│  │ ⚡ DApp    ×3   Buy  │   │
│  │ 🖥 Node   ×0   Buy  │   │
│  └──────────────────────┘   │
└─────────────────────────────┘
```

**Cyberpunk neon aesthetic:**
- Background: `#0a0a0f`
- Accent: electric cyan `#00f5ff` + neon purple `#bf5af2`
- Glowing borders/text via CSS `box-shadow` / `text-shadow`
- Particle burst on tap (CSS keyframe animations, no canvas)
- Scrolling hex/binary background pattern

---

## Technical Architecture

### File Structure
```
nimclickr/
  index.html
  vite.config.ts
  tsconfig.json
  package.json
  src/
    main.ts
    App.vue                     # Layout shell, mounts game loop on setup
    stores/
      game.ts                   # Pinia store: all state + actions
    composables/
      useGameLoop.ts            # Game tick (100ms) + persistence (10s interval + beforeunload)
      useNumberFormat.ts        # formatNum(1_200_000) → "1.2M"
    components/
      TpsDisplay.vue            # TPS counter + total transactions
      ClickButton.vue           # Tap target + CSS particle animation
      BuildingList.vue          # Scrollable building buy panel
      UpgradeList.vue           # Scrollable upgrade buy panel
      TabBar.vue                # Buildings/Upgrades tab switcher
    data/
      buildings.ts              # Static building definitions
      upgrades.ts               # Static upgrade definitions
    types/
      index.ts                  # BuildingId, UpgradeId, GameState types
```

### Pinia Store State Shape (`src/stores/game.ts`)
```ts
{
  transactions: number,         // current spendable currency
  totalTransactions: number,    // all-time counter (score display)
  buildings: Record<BuildingId, { owned: number }>,
  upgrades: Record<UpgradeId, { purchased: boolean }>,
  // computed:
  clickPower: number,           // base 1 × click upgrade multipliers
  tps: number,                  // sum of (building.owned × building.tps × multipliers)
}
```

### Key Actions (store)
- `clickTransaction()` — add `clickPower` to transactions + totalTransactions
- `buyBuilding(id)` — deduct cost, increment owned, recompute tps
- `buyUpgrade(id)` — deduct cost, mark purchased, recompute multipliers + tps
- `tick(delta)` — add `tps * delta` to transactions + totalTransactions
- `saveGame()` / `loadGame()` — JSON serialize/deserialize to localStorage

### Game Loop (`src/composables/useGameLoop.ts`)
```ts
// Tick: 100ms interval
setInterval(() => store.tick(0.1), 100)

// Persistence: 10s interval (NOT on every state change)
setInterval(() => store.saveGame(), 10_000)

// Save on tab close
window.addEventListener('beforeunload', () => store.saveGame())
```

### Number Formatting (`src/composables/useNumberFormat.ts`)
Thresholds: K (1e3), M (1e6), B (1e9), T (1e12), Qa (1e15)
Returns string like `"4.2M"`, `"1.34B"`

---

## Implementation Steps

1. **Scaffold project** — `npm create vite@latest nimclickr -- --template vue-ts`, add Pinia
2. **Types & static data** — `types/index.ts`, `data/buildings.ts`, `data/upgrades.ts`
3. **Pinia store** — full game state, all actions, save/load, computed tps/clickPower
4. **Game loop composable** — tick + persistence intervals, beforeunload handler
5. **Number format composable** — formatNum utility
6. **ClickButton component** — tap handler, CSS ripple/particle animation
7. **TpsDisplay component** — reactive TPS + total tx display
8. **BuildingList component** — list of buildings, affordability highlight, buy button
9. **UpgradeList component** — list of unlocked upgrades, buy button
10. **TabBar component** — tab switcher between Buildings and Upgrades
11. **App.vue layout** — wire all components, mount game loop
12. **Global CSS** — cyberpunk theme, background pattern, glow effects, mobile viewport

---

## Verification

1. `npm run dev` — app loads at localhost, no console errors
2. Tap button → transaction count increases, click particle fires
3. Buy a Wallet → TPS increases from 0 to 0.1, transactions tick up passively
4. Buy all 4 building types → TPS compounds correctly
5. Buy upgrades → verify multipliers apply (wallet upgrade should 2x wallet TPS contribution)
6. Wait 10s → refresh page → verify progress restored from localStorage
7. Close tab between 10s intervals → verify `beforeunload` save works
8. Test on mobile viewport (375px) — layout fits without horizontal scroll, tap targets ≥44px
