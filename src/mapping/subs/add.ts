import { create, get, getOrCreate } from '@kodadot1/metasquid/entity'

import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Action, Context } from '../../utils/types'
import { getAddSubCall, getSetIdentityCall, getSetSubsCall } from '../getters'
import { ChainOrigin, Identity, Sub } from '../../model'

const OPERATION = `CALL::ADD_SUB` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleSubAdd(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getAddSubCall)
  debug(OPERATION, call)

  const id = call.caller

  const identity = await get(context.store, Identity, id)

  if (!identity) {
    skip(OPERATION, `Identity not found`)
    return
  }

  const sub = create(Sub, call.address, {
    name: call.data,
    identity,
    blockNumber: BigInt(call.blockNumber),
    createdAt: call.timestamp,
    updatedAt: call.timestamp,
    origin: ChainOrigin.PEOPLE,
  })

  await context.store.save(sub)
  success(OPERATION, `${id}/${call.address}`)
}
