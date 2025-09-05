import { create, get } from '@kodadot1/metasquid/entity'

import { ChainOrigin, Identity, Sub } from '../../model'
import { unwrap } from '../../utils/extract'
import { subNameOf } from '../../utils/helper'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getSubIdentityAddEvent } from '../getters'

const OPERATION = `EVENT::ADD_SUB` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleSubAdd(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getSubIdentityAddEvent)
  debug(OPERATION, event)

  const id = event.main

  const identity = await get(context.store, Identity, id)

  if (!identity) {
    skip(OPERATION, `Identity not found`)
    return
  }

  const sub = create(Sub, event.sub, {
    name: subNameOf(id, event.address),
    identity,
    blockNumber: BigInt(event.blockNumber),
    createdAt: event.timestamp,
    updatedAt: event.timestamp,
    origin: event.origin || ChainOrigin.PEOPLE,
    deposit: event.deposit,
  })

  await context.store.save(sub)
  success(OPERATION, `${id}/${event.address}`)
}
