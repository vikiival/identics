import { get, getOrCreate } from '@kodadot1/metasquid/entity'

import { Identity, Username, UsernameStatus } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getSetPrimaryUsernameCall } from '../getters'

const OPERATION = `CALL::SET_PRIMARY_USERNAME` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handlePrimaryUsernameSetCall(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getSetPrimaryUsernameCall)
  debug(OPERATION, event)

  const id = event.username
  const final = await getOrCreate(context.store, Username, id, {})

  final.createdAt = event.timestamp
  final.primary = true
  final.name = event.username
  final.status = UsernameStatus.Active

  const identity = await get(context.store, Identity, event.who)
  final.identity = identity

  await context.store.save(final)
}
