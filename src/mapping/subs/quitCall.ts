import { get } from '@kodadot1/metasquid/entity'
import { Sub } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getQuitSubCall } from '../getters'

const OPERATION = `CALL::QUIT_SUB` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleSubQuitCall(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getQuitSubCall)
  debug(OPERATION, event)

  const id = event.caller
  const final = await get(context.store, Sub, id)
  if (final) {
    await context.store.remove(final)
  }

  success(OPERATION, `${event.main}/${id}`)
}
