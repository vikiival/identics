import { get } from '@kodadot1/metasquid/entity'

import { Sub } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getRenameSubCall } from '../getters'

const OPERATION = `CALL::RENAME_SUB` //Action.CREATE

/**
 * Handle the sub-identity alter call (Identity.rename_sub)
 * Renames existing Sub entity
 * Logs CALL::RENAME_SUB call
 * @param context - the context for the Call
 */
export async function handleSubRename(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getRenameSubCall)
  debug(OPERATION, call, true)

  const id = call.address
  const final = await get(context.store, Sub, id)
  if (!final) {
    skip(OPERATION, `Sub not found: ${id}`)
    return
  }

  final.name = call.data || ''
  final.updatedAt = call.timestamp

  success(OPERATION, `${call.caller}/${id}`)
  await context.store.save(final)
}
