import { get } from '@kodadot1/metasquid/entity'

import { Username } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getUsernameRemoveEvent } from '../getters'

const OPERATION = `EVENT::REMOVE_USERNAME`

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleUsernameRemove(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getUsernameRemoveEvent)
  debug(OPERATION, event)

  const id = event.username
  const final = await get(context.store, Username, id)

  if (final) {
    await context.store.remove(final)
  }

  success(OPERATION, `${event.username}/${id}`)
}
