import { logger } from '@kodadot1/metasquid/logger'

import { Store } from "@subsquid/typeorm-store"
import { IdentityCall as IdxCall, IdentityEvent as IdxEvent } from '../processable'
import { ProcessorContext } from '../processor'
import { debug } from '../utils/logger'
import { Context, SelectedCall, SelectedEvent } from '../utils/types'
import * as idx from './identities'

type EventHandlerFunction = <T extends SelectedEvent>(item: T, ctx: Context) => Promise<void>
type CallHandlerFunction = <T extends SelectedCall>(item: T, ctx: Context) => Promise<void>

/**
 * Main entry point for processing events
 * @param item - the event to process
 * @param ctx - the context for the event
 **/
export async function events<T extends SelectedEvent>(item: T, ctx: Context): Promise<void> {
  switch (item.name) {
    case IdxEvent.setIdentity:
      logger.info(`Processing event ${item.name}`)
      debug(`EVENT::${item.name}`, item, true)
      break
    default:
      logger.error(`Unknown event ${item.name}`)
      // throw new Error(`Unknown event ${item.name}`)
  }
}

export async function calls<T extends SelectedCall>(item: T, ctx: Context): Promise<void> {
  switch (item.name) {
    case IdxCall.setIdentity:
      await idx.handleIdentitySet(ctx)
      break
    case IdxCall.provideJudgement:
      await idx.handleJudgementProvide(ctx)
      break
    case IdxCall.addSub:
      await idx.handleSubAdd(ctx)
      break
    case IdxCall.setSubs:
      await idx.handleSubListSet(ctx)
      break
    case IdxCall.renameSub:
      await idx.handleSubRename(ctx)
      break
    case IdxCall.addUsernameAuthority:
      await idx.handleUsernameAuthorityAdd(ctx)
    case IdxCall.removeUsernameAuthority:
      await idx.handleUsernameAuthorityRemove(ctx)
    default:
      debug(`CALL::${item.name}`, item, true)
      throw new Error(`Unknown call ${item.name}`)
  }
}

/**
 * mainFrame is the main entry point for processing a batch of blocks
**/
export async function mainFrame(ctx: ProcessorContext<Store>): Promise<void> {
  const start = ctx.blocks[0].header.height

  logger.info(
    `Processing ${ctx.blocks.length} blocks from ${ctx.blocks[0].header.height} to ${
      ctx.blocks[ctx.blocks.length - 1].header.height
    }`
  )
  

  for (const block of ctx.blocks) {
    for (const call of block.calls) {
      logger.debug(`Processing call: ${call.name}`)
      await calls(call, {
        event: call.events[0],
        block: block.header,
        store: ctx.store,
        extrinsic: call.extrinsic,
        call: call,
      })
    }

    for (const event of block.events) {
      logger.debug(`Processing event: ${event.name}`)
      debug(`EVENT::${event.name}`, event, true)
    }
  }

  if (ctx.isHead) {
    const lastBlock = ctx.blocks[ctx.blocks.length - 1].header
    const lastDate = new Date(lastBlock.timestamp || Date.now())
    logger.info(`Found head block, updating cache`)
    // await updateOfferCache(lastDate, lastBlock.height, ctx.store)  
  }
}