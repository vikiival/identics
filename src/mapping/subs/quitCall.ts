import { get } from '@kodadot1/metasquid/entity'
import { Sub } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getQuitSubCall } from '../getters'

const OPERATION = `CALL::QUIT_SUB` //Action.CREATE

/**
 * Handle the sub-identity remove call (Identity.quit_sub)
 * Removes existing Sub entity
 * Logs CALL::QUIT_SUB call
 * @param context - the context for the Call
 */
export async function handleSubQuitCall(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getQuitSubCall)
  debug(OPERATION, call)

  const id = call.caller
  const final = await get(context.store, Sub, id)
  if (final) {
    await context.store.remove(final)
  }

  success(OPERATION, `${call.main}/${id}`)
}
