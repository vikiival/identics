import {
  create,
  findByIdListAsMap as getMany,
  get,
} from '@kodadot1/metasquid/entity'

import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Action, Context } from '../../utils/types'
import { getSetIdentityCall, getSetSubsCall } from '../getters'
import { ChainOrigin, Identity, Sub } from '../../model'

const OPERATION = `CALL::SET_SUBS` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleSubListSet(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getSetSubsCall)
  debug(OPERATION, call)

  const id = call.caller
  const identity = await get(context.store, Identity, id)

  if (!identity) {
    skip(OPERATION, `Identity not found`)
    return
  }

  const subs = call.subs.map((sub) =>
    create(Sub, sub.address, {
      name: sub.data,
      identity,
      blockNumber: BigInt(call.blockNumber),
      createdAt: call.timestamp,
      updatedAt: call.timestamp,
      origin: ChainOrigin.PEOPLE,
    })
  )

  success(OPERATION, `${id}/${call.subs.length}`)
  await context.store.upsert(subs)
}
