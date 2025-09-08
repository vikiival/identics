import { create, get } from '@kodadot1/metasquid/entity'

import { ChainOrigin, Identity, Sub } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import md5 from 'md5'
import { addressTypeOf, subNameOf } from '../../utils/helper'
import { getSetSubsCall } from '../getters'

const OPERATION = `CALL::SET_SUBS` //Action.CREATE

/**
 * Handle the sub-identity create call (Identity.set_subs)
 * Creates a new Sub entities
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleSubListSet(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getSetSubsCall)
  debug(OPERATION, call, true)

  const id = call.caller
  const identity = await get(context.store, Identity, id)

  if (!identity) {
    skip(OPERATION, `NO Identity of ${id}`)
    return
  }

  if (call.subs.length === 0) {
    skip(OPERATION, `NO SUBS for ${id}`)
    return
  }

  // Use Map to deduplicate subs by address (key)
  const subsMap = new Map<string, Sub>()

  call.subs.forEach((sub: any) => {
    subsMap.set(
      sub.address,
      create(Sub, sub.address, {
        name: sub.data || subNameOf(id, sub.address),
        identity,
        blockNumber: BigInt(call.blockNumber),
        createdAt: call.timestamp,
        updatedAt: call.timestamp,
        origin: call.origin || ChainOrigin.PEOPLE,
        type: addressTypeOf(sub.address),
      })
    )
  })

  // Convert Map values back to array
  const uniqueSubs = Array.from(subsMap.values())

  success(
    OPERATION,
    `${id}/${uniqueSubs.length} (${call.subs.length} total, ${
      call.subs.length - uniqueSubs.length
    } duplicates removed)`
  )
  await context.store.upsert(uniqueSubs)
}
