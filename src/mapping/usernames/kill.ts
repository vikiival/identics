import { get, getOrCreate } from '@kodadot1/metasquid/entity'

import { Identity, Username } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending } from '../../utils/logger'
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
  const final = await getOrCreate(context.store, Username, id, {})

  final.createdAt = event.timestamp

  const identity = await get(context.store, Identity, event.who)
  final.identity = identity
}
