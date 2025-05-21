import { get } from '@kodadot1/metasquid/entity'
import { Sub } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getRemoveSubCall, getSubIdentityRemovedEvent } from '../getters'

const OPERATION = `CALL::REMOVE_SUB` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleSubRemove(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getSubIdentityRemovedEvent)
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
