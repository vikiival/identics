export type Chain = 'people' | 'polkadot'

export const CHAIN: Chain = (process.env.CHAIN as Chain) || 'polkadot'
