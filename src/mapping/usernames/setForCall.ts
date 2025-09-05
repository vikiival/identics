import { get, getOrCreate } from '@kodadot1/metasquid/entity'

import { Identity, Username, UsernameStatus } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getSetUsernameForCall } from '../getters'

const OPERATION = `CALL::SET_USERNAME_FOR`

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleUsernameSetForCall(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getSetUsernameForCall)
  debug(OPERATION, event)

  const id = event.username
  const final = await getOrCreate(context.store, Username, id, {})

  final.createdAt = event.timestamp
  final.primary = false
  final.name = event.username
  final.status = UsernameStatus.Queued

  const identity = await get(context.store, Identity, event.who)
  final.identity = identity

  await context.store.save(final)
}
