import type { BuildingDef } from '../types'

export const BUILDINGS: BuildingDef[] = [
  {
    id: 'wallet',
    name: 'Wallet',
    emoji: '🔑',
    baseCost: 10,
    baseTps: 0.1,
    description: 'You sign transactions manually.',
  },
  {
    id: 'faucet',
    name: 'Faucet',
    emoji: '💧',
    baseCost: 100,
    baseTps: 0.5,
    description: 'Drips free tokens — each drip is a transaction.',
  },
  {
    id: 'dapp',
    name: 'DApp',
    emoji: '⚡',
    baseCost: 1_000,
    baseTps: 5,
    description: 'Users interacting with your app create transactions.',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    emoji: '📣',
    baseCost: 8_000,
    baseTps: 40,
    description: 'Campaigns bring in users who all transact.',
  },
  {
    id: 'spammer',
    name: 'Spammer',
    emoji: '🤖',
    baseCost: 75_000,
    baseTps: 300,
    description: 'Bots flooding the mempool with transactions.',
  },
  {
    id: 'exchange',
    name: 'Exchange',
    emoji: '🏦',
    baseCost: 500_000,
    baseTps: 2_000,
    description: 'High-frequency trading generates massive volume.',
  },
  {
    id: 'market_maker',
    name: 'Market Maker',
    emoji: '📈',
    baseCost: 5_000_000,
    baseTps: 15_000,
    description: 'Algo bots placing continuous orders.',
  },
  {
    id: 'use_case',
    name: 'Use Case',
    emoji: '🌍',
    baseCost: 50_000_000,
    baseTps: 100_000,
    description: 'Killer app driving organic mass adoption.',
  },
]

export const COST_SCALE = 1.15

/** Compute the current cost to buy one more unit of a building */
export function buildingCost(baseCost: number, owned: number): number {
  return Math.floor(baseCost * Math.pow(COST_SCALE, owned))
}
