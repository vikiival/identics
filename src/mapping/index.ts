import { logger } from '@kodadot1/metasquid/logger'

import { Store } from '@subsquid/typeorm-store'
import { ProcessorContext } from '../people/processor'
import {
  IdentityCall as IdxCall,
  IdentityEvent as IdxEvent,
} from '../processable'
import { debug } from '../utils/logger'
import { Context, SelectedCall, SelectedEvent } from '../utils/types'
import * as idx from './identities'
import * as jud from './judgements'
import * as reg from './registrars'
import * as sub from './subs'
import * as usrn from './usernames'

type EventHandlerFunction = <T extends SelectedEvent>(
  ctx: Context
) => Promise<void>
type CallHandlerFunction = <T extends SelectedCall>(
  ctx: Context
) => Promise<void>

function skipEvent(
  what: IdxCall | IdxEvent,
  reason: string
): (ctx: Context) => Promise<void> {
  logger.error(`Unhandled ${what}: ${reason}`)
  return async (ctx: Context) => debug(what as any, ctx.event, true)
}

function skipCall(
  what: IdxCall | IdxEvent,
  reason: string
): (ctx: Context) => Promise<void> {
  logger.error(`Unhandled ${what}: ${reason}`)
  return async (ctx: Context) => debug(what as any, ctx.call, true)
}

const eventHandlers: Record<string, EventHandlerFunction> = {
  [IdxEvent.setIdentity]: skipEvent(
    IdxEvent.setIdentity,
    'USELESS, DO NOT USE'
  ), //idx.handleIdentitySet, // USELESS, DO NOT USE
  [IdxEvent.clearIdentity]: idx.handleIdentityClear,
  [IdxEvent.killIdentity]: idx.handleIdentityKill,
  [IdxEvent.addSubIdentity]: skipEvent(
    IdxEvent.addSubIdentity,
    `USED FROM CALL ${IdxCall.addSub}`
  ), // sub.handleSubAdd,
  //   [IdxEvent.setSubIdentities]: idx.handleSubIdentitiesSetEvent,
  //   [IdxEvent.renameSubIdentity]: idx.handleSubIdentityRenamedEvent,
  [IdxEvent.removeSubIdentity]: sub.handleSubRemove,
  [IdxEvent.revokeSubIdentity]: sub.handleSubQuit,
  [IdxEvent.requestJudgement]: jud.handleJudgementRequest,
  [IdxEvent.giveJudgement]: skipEvent(
    IdxEvent.giveJudgement,
    `USED FROM CALL ${IdxCall.provideJudgement}`
  ), //jud.handleJudgementProvide,
  [IdxEvent.addRegistrar]: reg.handleRegistrarAdd,
  [IdxEvent.unrequestJudgement]: jud.handleJudgementUnrequest,
  // [IdxEvent.addAuthority]: jud.handleAuthorityAddedEvent,
  // [IdxEvent.removeAuthority]: jud.handleAuthorityRemovedEvent,
  [IdxEvent.setUsername]: usrn.handleUsernameSet,
  // [IdxEvent.queueUsername]: usrn.handleUsernameQueuedEvent,
  // [IdxEvent.expirePreapproval]: usrn.handlePreapprovalExpiredEvent,
  [IdxEvent.setPrimaryUsername]: usrn.handlePrimaryUsernameSet,
  [IdxEvent.removeDanglingUsername]: usrn.handleDanglingUsernameRemove,
  [IdxEvent.unbindUsername]: usrn.handleUsernameUnbind,
  [IdxEvent.removeUsername]: usrn.handleUsernameRemove,
  [IdxEvent.killUsername]: usrn.handleUsernameKill,
}

const callHandlers: Record<string, CallHandlerFunction> = {
  [IdxCall.setIdentity]: idx.handleIdentitySetCall,
  [IdxCall.clearIdentity]: skipCall(
    IdxCall.clearIdentity,
    `USED FROM EVENT ${IdxEvent.clearIdentity}`
  ), // USED FROM EVENT
  [IdxCall.killIdentity]: skipCall(
    IdxCall.killIdentity,
    `USED FROM EVENT ${IdxEvent.killIdentity}`
  ), // idx.handleIdentityKillCall,
  [IdxCall.provideJudgement]: jud.handleJudgementProvide,
  [IdxCall.addSub]: sub.handleSubAddCall,
  [IdxCall.setSubs]: sub.handleSubListSet,
  [IdxCall.renameSub]: sub.handleSubRename,
  [IdxCall.removeSub]: skipCall(
    IdxCall.removeSub,
    `USED FROM EVENT ${IdxEvent.removeSubIdentity}`
  ), // USED FROM EVENT
  [IdxCall.quitSub]: sub.handleSubQuitCall, // USED FROM EVENT
  [IdxCall.addUsernameAuthority]: usrn.handleUsernameAuthorityAdd,
  [IdxCall.removeUsernameAuthority]: usrn.handleUsernameAuthorityRemove,
  [IdxCall.addRegistrar]: skipCall(
    IdxCall.addRegistrar,
    `USED FROM EVENT ${IdxEvent.addRegistrar}`
  ), //reg.handleRegistrarAdd,
  [IdxCall.setFee]: reg.handleFeeSet,
  [IdxCall.setFields]: reg.handleFieldSet,
  [IdxCall.setAccountId]: reg.handleAccountIdSet,
  [IdxCall.requestJudgement]: skipCall(
    IdxCall.requestJudgement,
    `USED FROM EVENT ${IdxEvent.requestJudgement}`
  ), // jud.handleJudgementRequestCall, // USED FROM EVENT
  [IdxCall.cancelRequest]: jud.handleJudgementCancel,
  [IdxCall.setUsernameFor]: skipCall(
    IdxCall.setUsernameFor,
    `USED FROM EVENT ${IdxEvent.setUsername}`
  ), // usrn.handleUsernameSetForCall,
  // [IdxCall.acceptUsername]: usrn.handleUsernameAcceptCall, // NOT NEEDED as it can be handled by Username set
  // [IdxCall.setPrimaryUsername]: usrn.handlePrimaryUsernameSet, // USED FROM EVENT, RECHECK
  [IdxCall.removeExpiredApproval]: usrn.handleExpiredApprovalRemove,
  [IdxCall.removeDanglingUsername]: usrn.handleDanglingUsernameRemoveCall,
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
    throw Error(`NO EVENT handler FOR ${item.name}`)
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
    if (item.name === 'Utility.batch' || item.name === 'Council.close') {
      debug(
        `CALL::UNPROCESSABLE`,
        { name: item.name, args: item.args, block: item.block.height },
        true
      )
      logger.error(`Unknown call ${item.name}`)
      return
    }
    throw Error(`NO CALL handler FOR ${item.name}`)
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
      logger.debug(
        `Processing call: ${call.name} / ${call.success ? 'OK' : 'ERR'}`
      )

      if (call.success) {
        debug(`CALL::${call.name}`, call.events, true)
        await calls(call, {
          event: call.events[0],
          block: block.header,
          store: ctx.store,
          extrinsic: call.extrinsic,
          call: call,
        })
      }
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
