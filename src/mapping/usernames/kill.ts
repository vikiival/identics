import { get, getOrCreate } from '@kodadot1/metasquid/entity'

import { Identity, Username } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getUsernameKillEvent } from '../getters'

const OPERATION = `EVENT::KILL_USERNAME`

/**
 * Handle the identity removal event (Identity.UsernameKilled)
 * Removes existing Username entity
 * Logs Action.CREATE event
 * @param context - the context for the Event
 */
export async function handleUsernameKill(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getUsernameKillEvent)
  debug(OPERATION, event)

  const id = event.username
  const final = await get(context.store, Username, id)
  const address = final?.address

  if (final) {
    await context.store.remove(final)
  }

  success(OPERATION, `${id}/${address}`)
}
