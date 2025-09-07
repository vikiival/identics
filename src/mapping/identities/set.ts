import { getOrCreate } from '@kodadot1/metasquid/entity'

import { ChainOrigin, Identity } from '../../model'
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
  debug(OPERATION, call)

  const id = call.caller
  const final = await getOrCreate(context.store, Identity, id, {})

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
}
