import { get, getOrCreate } from '@kodadot1/metasquid/entity'

import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Action, Context } from '../../utils/types'
import { getSetFeeCall, getSetFieldCall } from '../getters'
import { Identity, Registrar } from '../../model'

const OPERATION = `CALL::SET_FIELDS`

/**
 * Handle the identity create call (Identity.set_fields)
 * Set the field information for a registrar.
 * Logs CALL::SET_FIELDS event
 * @param context - the context for the Call
 */
export async function handleFieldSet(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getSetFieldCall)
  debug(OPERATION, call)

  const id = call.index.toString()
  const final = await get(context.store, Registrar, id)

  if (!final) {
    skip(OPERATION, `Registrar not found: ${id}`)
    return
  }

  // DEV: bitmap of required fields
  final.field = call.fields
  final.updatedAt = call.timestamp

  success(OPERATION, `${final.id}/${final.field}`)
  await context.store.save(final)
}
