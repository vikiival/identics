import { logger } from '@kodadot1/metasquid/logger'

import { Store } from '@subsquid/typeorm-store'
import {
  IdentityCall as IdxCall,
  IdentityEvent as IdxEvent,
} from '../processable'
import { ProcessorContext } from '../processor'
import { debug, error } from '../utils/logger'
import { Context, SelectedCall, SelectedEvent } from '../utils/types'
import * as idx from './identities'
import * as sub from './subs'
import * as jud from './judgements'

type EventHandlerFunction = <T extends SelectedEvent>(
  ctx: Context
) => Promise<void>
type CallHandlerFunction = <T extends SelectedCall>(
  ctx: Context
) => Promise<void>

const eventHandlers: Record<string, EventHandlerFunction> = {
  //   // [IdxEvent.setIdentity]: idx.handleIdentitySetEvent, // call
  //   [IdxEvent.clearIdentity]: idx.handleIdentityClearedEvent,
  //   [IdxEvent.killIdentity]: idx.handleIdentityKilledEvent,
  //   [IdxEvent.addSubIdentity]: idx.handleSubIdentityAddedEvent,
  //   [IdxEvent.setSubIdentities]: idx.handleSubIdentitiesSetEvent,
  //   [IdxEvent.renameSubIdentity]: idx.handleSubIdentityRenamedEvent,
  //   [IdxEvent.removeSubIdentity]: idx.handleSubIdentityRemovedEvent,
  //   [IdxEvent.revokeSubIdentity]: idx.handleSubIdentityRevokedEvent,
  [IdxEvent.requestJudgement]: jud.handleJudgementRequest,
  //   [IdxEvent.giveJudgement]: idx.handleJudgementGivenEvent,
  //   [IdxEvent.addRegistrar]: idx.handleRegistrarAddedEvent,
  //   [IdxEvent.unrequestJudgement]: idx.handleJudgementUnrequestedEvent,
  //   [IdxEvent.addAuthority]: idx.handleAuthorityAddedEvent,
  //   [IdxEvent.removeAuthority]: idx.handleAuthorityRemovedEvent,
  //   // [IdxEvent.setUsername]: idx.handleUsernameSetEvent,
  //   // [IdxEvent.queueUsername]: idx.handleUsernameQueuedEvent,
  //   // [IdxEvent.expirePreapproval]: idx.handlePreapprovalExpiredEvent,
  //   // [IdxEvent.setPrimaryUsername]: idx.handlePrimaryUsernameSetEvent,
  //   // [IdxEvent.removeDanglingUsername]: idx.handleDanglingUsernameRemovedEvent,
  //   // [IdxEvent.unbindUsername]: idx.handleUsernameUnboundEvent,
  //   // [IdxEvent.removeUsername]: idx.handleUsernameRemovedEvent,
  //   // [IdxEvent.killUsername]: idx.handleUsernameKilledEvent
}

const callHandlers: Record<string, CallHandlerFunction> = {
  [IdxCall.setIdentity]: idx.handleIdentitySet,
  //   // [IdxCall.clearIdentity]: idx.handleIdentityClear,
  //   // [IdxCall.killIdentity]: idx.handleIdentityKill,
  [IdxCall.provideJudgement]: jud.handleJudgementProvide,
  //   [IdxCall.addSub]: idx.handleSubAdd,
  [IdxCall.setSubs]: sub.handleSubListSet,
  //   [IdxCall.renameSub]: idx.handleSubRename,
  //   // [IdxCall.removeSub]: idx.handleSubRemove,
  //   // [IdxCall.quitSub]: idx.handleSubQuit,
  //   [IdxCall.addUsernameAuthority]: idx.handleUsernameAuthorityAdd,
  //   [IdxCall.removeUsernameAuthority]: idx.handleUsernameAuthorityRemove,
  //   [IdxCall.addRegistrar]: idx.handleRegistrarAdd,
  //   [IdxCall.setFee]: idx.handleFeeSet,
  //   [IdxCall.setFields]: idx.handleFieldSet,
  //   [IdxCall.setAccountId]: idx.handleAccountIdSet,
  //   // [IdxCall.requestJudgement]: idx.handleJudgementRequest,
  //   // [IdxCall.cancelRequest]: idx.handleJudgementRequestCancel,
  //   // [IdxCall.setUsernameFor]: idx.handleUsernameSetFor,
  //   // [IdxCall.acceptUsername]: idx.handleUsernameAccept,
  //   // [IdxCall.setPrimaryUsername]: idx.handleUsernamePrimarySet,
  //   // [IdxCall.removeExpiredApproval]: idx.handleUsernameExpiredApprovalRemove,
  //   // [IdxCall.removeDanglingUsername]: idx.handleUsernameDanglingRemove
}

/**
 * Main entry point for processing events
 * @param item - the event to process
 * @param ctx - the context for the event
 **/
export async function events<T extends SelectedEvent>(
  item: T,
  ctx: Context
): Promise<void> {
  const handler = eventHandlers[item.name as IdxEvent]
  if (!handler) {
    logger.error(`Unknown event ${item.name}`)
    debug(`EVENT::${item.name}`, item, true)
    return
  }

  return handler(ctx)
}

export async function calls<T extends SelectedCall>(
  item: T,
  ctx: Context
): Promise<void> {
  const handler = callHandlers[item.name as IdxCall]
  if (!handler) {
    logger.error(`Unknown call ${item.name}`)
    debug(`CALL::${item.name}`, item, true)
    return
  }

  return handler(ctx)
}

/**
 * mainFrame is the main entry point for processing a batch of blocks
 **/
export async function mainFrame(ctx: ProcessorContext<Store>): Promise<void> {
  const start = ctx.blocks[0].header.height
  const end = ctx.blocks[ctx.blocks.length - 1].header.height

  logger.info(`Processing ${ctx.blocks.length} blocks from ${start} to ${end}`)

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
      if (!event.call) {
        throw new Error(`${event.name} does not have a call`)
      }
      await events(event, {
        event: event,
        block: block.header,
        store: ctx.store,
        extrinsic: event.extrinsic,
        call: event.call as SelectedCall,
      })
    }
  }

  if (ctx.isHead) {
    const lastBlock = ctx.blocks[ctx.blocks.length - 1].header
    const lastDate = new Date(lastBlock.timestamp || Date.now())
    logger.info(`Found head block, updating cache`)
    // await updateOfferCache(lastDate, lastBlock.height, ctx.store)
  }
}
