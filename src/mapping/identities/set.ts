import { create, getOrCreate } from '@kodadot1/metasquid/entity'
import md5 from 'md5'
import { serializer } from '@kodadot1/metasquid'
import { ChainOrigin, Identity, Event } from '../../model'
import { unwrap } from '../../utils/extract'
import { addressTypeOf } from '../../utils/helper'
import { debug, pending, success } from '../../utils/logger'
import { Action, Context } from '../../utils/types'
import { getSetIdentityCall } from '../getters'

const OPERATION = Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleIdentitySetCall(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getSetIdentityCall)
  debug(OPERATION, call, true)

  const id = call.caller
  const final = await getOrCreate(context.store, Identity, id, {})

  const meta = JSON.stringify(final, serializer)

  // Set properties from basic
  final.blockNumber = BigInt(call.blockNumber)
  final.createdAt = call.timestamp
  final.updatedAt = call.timestamp
  final.origin = call.origin || ChainOrigin.PEOPLE
  final.burned = false
  final.deposit = BigInt(0n)

  // Set properties from IdentityInfo
  final.name = call.display
  final.legal = call.legal
  final.web = call.web
  final.matrix = call.matrix
  final.email = call.email
  final.image = call.image
  final.twitter = call.twitter
  final.github = call.github
  final.discord = call.discord

  final.type = addressTypeOf(id)

  success(OPERATION, `${final.id}`)
  await context.store.save(final)

  const eventId = md5(
    `${OPERATION}-${Math.random()}-${process.env.CHAIN}-${
      context.block.height
    }-${call.caller}`
  )
  const interaction = create(Event, eventId, {
    blockNumber: BigInt(context.block.height),
    timestamp: call.timestamp,
    caller: call.caller,
    currentOwner: call.caller,
    interaction: OPERATION,
    identity: final,
    meta,
  })
  await context.store.save(interaction)
}
