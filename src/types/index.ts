export type BuildingId =
  | 'wallet'
  | 'faucet'
  | 'dapp'
  | 'marketing'
  | 'spammer'
  | 'exchange'
  | 'market_maker'
  | 'use_case'

export type UpgradeId =
  // Building upgrades: {buildingId}_{1..11}
  | 'wallet_1' | 'wallet_2' | 'wallet_3' | 'wallet_4' | 'wallet_5'
  | 'wallet_6' | 'wallet_7' | 'wallet_8' | 'wallet_9' | 'wallet_10' | 'wallet_11'
  | 'faucet_1' | 'faucet_2' | 'faucet_3' | 'faucet_4' | 'faucet_5'
  | 'faucet_6' | 'faucet_7' | 'faucet_8' | 'faucet_9' | 'faucet_10' | 'faucet_11'
  | 'dapp_1' | 'dapp_2' | 'dapp_3' | 'dapp_4' | 'dapp_5'
  | 'dapp_6' | 'dapp_7' | 'dapp_8' | 'dapp_9' | 'dapp_10' | 'dapp_11'
  | 'marketing_1' | 'marketing_2' | 'marketing_3' | 'marketing_4' | 'marketing_5'
  | 'marketing_6' | 'marketing_7' | 'marketing_8' | 'marketing_9' | 'marketing_10' | 'marketing_11'
  | 'spammer_1' | 'spammer_2' | 'spammer_3' | 'spammer_4' | 'spammer_5'
  | 'spammer_6' | 'spammer_7' | 'spammer_8' | 'spammer_9' | 'spammer_10' | 'spammer_11'
  | 'exchange_1' | 'exchange_2' | 'exchange_3' | 'exchange_4' | 'exchange_5'
  | 'exchange_6' | 'exchange_7' | 'exchange_8' | 'exchange_9' | 'exchange_10' | 'exchange_11'
  | 'market_maker_1' | 'market_maker_2' | 'market_maker_3' | 'market_maker_4' | 'market_maker_5'
  | 'market_maker_6' | 'market_maker_7' | 'market_maker_8' | 'market_maker_9' | 'market_maker_10' | 'market_maker_11'
  | 'use_case_1' | 'use_case_2' | 'use_case_3' | 'use_case_4' | 'use_case_5'
  | 'use_case_6' | 'use_case_7' | 'use_case_8' | 'use_case_9' | 'use_case_10' | 'use_case_11'
  // Click upgrades
  | 'click_1' | 'click_2' | 'click_3' | 'click_4' | 'click_5'

export interface BuildingDef {
  id: BuildingId
  name: string
  emoji: string
  baseCost: number
  baseTps: number
  description: string
}

export interface UpgradeDef {
  id: UpgradeId
  name: string
  description: string
  cost: number
  /** Which building this upgrade applies to (null for click upgrades) */
  buildingId: BuildingId | null
  /** TPS multiplier applied to the building (1.5 for building upgrades) */
  multiplier: number
  /** Unlock condition: units owned for building upgrades, tps threshold for click upgrades */
  unlockCondition: { type: 'owned'; buildingId: BuildingId; count: number } | { type: 'tps'; value: number }
}

export interface BuildingState {
  owned: number
}

export interface UpgradeState {
  purchased: boolean
}

export interface SavedGameState {
  transactions: number
  totalTransactions: number
  buildings: Record<BuildingId, BuildingState>
  upgrades: Record<UpgradeId, UpgradeState>
}
