import { create, get } from '@kodadot1/metasquid/entity'

import { ChainOrigin, Identity, Sub } from '../../model'
import { unwrap } from '../../utils/extract'
import { subNameOf } from '../../utils/helper'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getAddSubCall } from '../getters'

const OPERATION = `CALL::ADD_SUB`

/**
 * Handle the identity create call (Identity.add_sub)
 * Creates a new Sub entity
 * Logs CALL::ADD_SUB event
 * @param context - the context for the Call
 */
export async function handleSubAddCall(context: Context): Promise<void> {
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
    name: call.data || subNameOf(id, call.address),
    identity,
    blockNumber: BigInt(call.blockNumber),
    createdAt: call.timestamp,
    updatedAt: call.timestamp,
    origin: call.origin || ChainOrigin.PEOPLE,
  })

  await context.store.save(sub)
  success(OPERATION, `${id}/${call.address}`)
}
