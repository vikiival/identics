import {
  Block as _Block,
  BlockHeader,
  Call as _Call,
  DataHandlerContext,
  Event as _Event,
  Extrinsic as _Extrinsic,
  type SubstrateBatchProcessor as SubstrateProcessor,
  SubstrateBatchProcessorFields,
} from '@subsquid/substrate-processor'

import { Store as SquidStore } from '@subsquid/typeorm-store'
import { EntityManager } from 'typeorm'
import { Interaction } from '../model'

export type BaseCall = {
  caller: string
  blockNumber: string
  timestamp: Date
  name?: string
}

export const fieldSelection = {
  block: {
    timestamp: true,
  },
  extrinsic: {
    signature: true,
    success: true,
  },
  call: {
    name: true,
    args: true,
    origin: true,
    success: true,
  },
  event: {
    name: true,
    args: true,
    call: true,
  },
} as const

export type SelectedFields = typeof fieldSelection

type Fields = SubstrateBatchProcessorFields<SubstrateProcessor<SelectedFields>>
export type Block = _Block<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>

export type ManagedStore = SquidStore & { em: () => EntityManager }
export type Store = SquidStore // & { em: () => EntityManager }
export type BatchContext<S = Store> = DataHandlerContext<S, Fields>
export type SelectedBlock = Pick<
  BlockHeader<Fields>,
  'height' | 'timestamp' | 'hash'
>
export type SelectedEvent = Pick<Event, 'name' | 'args' | 'block' | 'call'>
export type SelectedExtrinsic = Pick<Extrinsic, 'signature' | 'call'>
export type SelectedCall = Pick<
  Call,
  'name' | 'origin' | 'extrinsic' | 'args' | 'block'
>

enum ChainOrigin {
  RELAY = 'RELAY',
  PEOPLE = 'PEOPLE',
}

export type Context<S = Store> = {
  store: S
  block: SelectedBlock
  event: SelectedEvent
  extrinsic: SelectedExtrinsic | undefined
  call: SelectedCall
  origin?: ChainOrigin
  // log: Logger
}

export type EventContext<S = Store> = Omit<Context<S>, 'call'>

export type Optional<T> = T | null

export interface IEvent<T extends Interaction> {
  interaction: T
  blockNumber: bigint
  caller: string
  currentOwner: string
  timestamp: Date
  meta: string
}

export type CallWith<T> = BaseCall & T

export type EntityConstructor<T> = {
  new (...args: any[]): T
}

export { Interaction as Action } from '../model'
