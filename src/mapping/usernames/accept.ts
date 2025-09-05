import { getOrCreate } from '@kodadot1/metasquid/entity'

import { Username, UsernameStatus } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getAcceptUsernameCall } from '../getters'

const OPERATION = `CALL::ACCEPT_USERNAME` //Action.CREATE

/**
 * Handle the identity create call (Identity.accept_username)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleUsernameAcceptCall(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getAcceptUsernameCall)
  debug(OPERATION, event)

  const id = event.username
  const final = await getOrCreate(context.store, Username, id, {})

  final.status = UsernameStatus.Active

  await context.store.save(final)
}
