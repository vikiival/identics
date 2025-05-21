import { get } from '@kodadot1/metasquid/entity'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getRemoveSubCall, getSubIdentityRevokedEvent } from '../getters'
import { Sub } from '../../model'

const OPERATION = `CALL::QUIT_SUB` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleSubQuit(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getSubIdentityRevokedEvent)
  debug(OPERATION, event)

  const id = event.sub
  const final = await get(context.store, Sub, id)
  if (!final) {
    skip(OPERATION, `Sub not found: ${id}`)
    return
  }

  success(OPERATION, `${event.main}/${id}`)
  await context.store.remove(final)
}
