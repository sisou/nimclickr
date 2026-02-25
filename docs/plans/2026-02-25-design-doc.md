# NimClickr — Blockchain Clicker Game
## Implementation Plan
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
| ID           | Name        | Base cost    | TPS/unit | Thematic rationale                              |
|--------------|-------------|--------------|----------|-------------------------------------------------|
| wallet       | Wallet      | 10 tx        | 0.1      | You sign transactions manually                  |
| faucet       | Faucet      | 100 tx       | 0.5      | Drips free tokens → each drip is a transaction  |
| dapp         | DApp        | 1,000 tx     | 5        | Users interacting with your app create txs      |
| marketing    | Marketing   | 8,000 tx     | 40       | Campaigns bring in users who all transact       |
| spammer      | Spammer     | 75,000 tx    | 300      | Bots flooding the mempool with transactions     |
| exchange     | Exchange    | 500,000 tx   | 2,000    | High-frequency trading generates massive volume |
| market_maker | Market Maker| 5,000,000 tx | 15,000   | Algo bots placing continuous orders             |
| use_case     | Use Case    | 50,000,000 tx| 100,000  | Killer app driving organic mass adoption        |

Cost scaling: `baseCost * 1.15^owned` (standard idle game curve)

### Upgrades (~93 total)
**Building upgrades — 11 per building, each gives ×1.5 on that building:**

| Step | Unlock condition (units owned) |
|------|-------------------------------|
| 1    | 25                            |
| 2    | 50                            |
| 3    | 75                            |
| 4    | 100                           |
| 5    | 150                           |
| 6    | 200                           |
| 7    | 250                           |
| 8    | 300                           |
| 9    | 350                           |
| 10   | 400                           |
| 11   | 500                           |

At max upgrades a fully upgraded building produces `1.5^11 ≈ 86×` its base TPS.

**Click-power upgrades — 5 total, each ×2 click power:**

| Step | Unlock at TPS  |
|------|----------------|
| 1    | 100            |
| 2    | 1,000          |
| 3    | 10,000         |
| 4    | 100,000        |
| 5    | 1,000,000      |

Max click power at full upgrades: `2^5 = 32×` base.

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
│  │ 🔑 Wallet      ×14  Buy  │
│  │ 💧 Faucet      ×3   Buy  │
│  │ ⚡ DApp        ×1   Buy  │
│  │ 📣 Marketing   ×0   Buy  │
│  │ 🤖 Spammer     ×0   Buy  │
│  │ 🏦 Exchange    ×0   Buy  │
│  │ 📈 Market Maker×0   Buy  │
│  │ 🌍 Use Case    ×0   Buy  │
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

Optional `decimalsBelow` parameter: show 1 decimal place when value is below the threshold.
- TPS display: `formatNum(tps, 10)` — 1 decimal below 10 TPS
- Transaction balance: `formatNum(transactions, 100)` — 1 decimal below 100 tx
- Building TPS contribution: `formatNum(tpsContrib, 10)` — 1 decimal below 10 TPS

---

## Verification

1. `pnpm dev` — app loads at localhost, no console errors
2. Tap button → transaction count increases, click particle fires
3. Buy a Wallet → TPS increases from 0 to 0.1, transactions tick up passively
4. Buy all 8 building types → TPS compounds correctly
5. Buy upgrades → verify multipliers apply (wallet upgrade should 1.5x wallet TPS contribution)
6. Wait 10s → refresh page → verify progress restored from localStorage
7. Close tab between 10s intervals → verify `beforeunload` save works
8. Test on mobile viewport (375px) — layout fits without horizontal scroll, tap targets ≥44px
