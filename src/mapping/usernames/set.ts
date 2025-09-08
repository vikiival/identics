import { get, getOrCreate } from '@kodadot1/metasquid/entity'

import { Identity, Username, UsernameStatus } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getUsernameSetEvent } from '../getters'

const OPERATION = `EVENT::USERNAME_SET`

/**
 * Handle the username set event (Identity.UsernameSet)
 * Creates a new Username entity
 * Logs EVENT::SET_USERNAME event
 * @param context - the context for the Call
 */
export async function handleUsernameSet(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getUsernameSetEvent)
  debug(OPERATION, event)

  const id = event.username
  const final = await getOrCreate(context.store, Username, id, {})

  final.createdAt = event.timestamp
  final.primary = false
  final.name = event.username
  final.status = UsernameStatus.Active

  const identity = await get(context.store, Identity, event.who)
  final.identity = identity

  await context.store.save(final)
}
