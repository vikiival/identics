import { get } from '@kodadot1/metasquid/entity'
import { Sub } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getRemoveSubCall } from '../getters'

const OPERATION = `CALL::REMOVE_SUB` //Action.CREATE

/**
 * Handle the sub-identity remove call (Identity.remove_sub)
 * Removes existing Sub entity
 * Logs CALL::REMOVE_SUB call
 * @param context - the context for the Call
 */
export async function handleSubRemoveCall(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getRemoveSubCall)
  debug(OPERATION, call, true)

  const id = call.sub
  const final = await get(context.store, Sub, id)
  if (!final) {
    skip(OPERATION, `Sub not found: ${id}`)
    return
  }

  success(OPERATION, `${call.main}/${id}`)
  await context.store.remove(final)
}
