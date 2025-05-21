import { get, getOrCreate } from '@kodadot1/metasquid/entity'

import { Identity, Username } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getPrimaryUsernameSetEvent } from '../getters'

const OPERATION = `CALL::SET_MAIN_USERNAME` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
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

  const identity = await get(context.store, Identity, event.who)
  final.identity = identity

  await context.store.save(final)
}
