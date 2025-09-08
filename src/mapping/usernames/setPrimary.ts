import { get, getOrCreate } from '@kodadot1/metasquid/entity'

import { Identity, Username, UsernameStatus } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getPrimaryUsernameSetEvent } from '../getters'

const OPERATION = `EVENT::USERNAME_SET_PRIMARY`

/**
 * Handle the username set event (Identity.PrimaryUsernameSet)
 * Creates a new Username entity
 * Logs EVENT::SET_USERNAME_PRIMARY event
 * @param context - the context for the Event
 */
export async function handlePrimaryUsernameSet(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getPrimaryUsernameSetEvent)
  debug(OPERATION, event)

  const id = event.username
  const final = await getOrCreate(context.store, Username, id, {})

  final.createdAt = event.timestamp
  final.primary = true
  final.name = event.username
  final.status = UsernameStatus.Active
  final.address = event.who
  final.blockNumber = event.blockNumber

  const identity = await get(context.store, Identity, event.who)
  final.identity = identity

  await context.store.save(final)
}
