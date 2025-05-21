import { get, getOrCreate } from '@kodadot1/metasquid/entity'

import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Action, Context } from '../../utils/types'
import { getSetFeeCall } from '../getters'
import { Identity, Registrar } from '../../model'

const OPERATION = `CALL::SET_FEE`

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleFeeSet(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getSetFeeCall)
  debug(OPERATION, call)

  const id = call.index.toString()
  const final = await get(context.store, Registrar, id)

  if (!final) {
    skip(OPERATION, `Registrar not found: ${id}`)
    return
  }

  final.fee = call.fee
  final.updatedAt = call.timestamp

  success(OPERATION, `${final.id}/${final.fee}`)
  await context.store.save(final)
}
