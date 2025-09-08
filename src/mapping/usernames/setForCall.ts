import { get, getOrCreate } from '@kodadot1/metasquid/entity'

import { Identity, Username, UsernameStatus } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getSetUsernameForCall } from '../getters'

const OPERATION = `CALL::USERNAME_SET_FOR`

/**
 * Handle the username set (for) call (Identity.set_username_for)
 * Creates a new Username entity
 * Logs CALL::SET_USERNAME_FOR call
 * @param context - the context for the Call
 */
export async function handleUsernameSetForCall(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getSetUsernameForCall)
  debug(OPERATION, call, true)

  const id = call.username
  const final = await getOrCreate(context.store, Username, id, {})

  final.createdAt = call.timestamp
  final.primary = false
  final.name = call.username
  final.status = UsernameStatus.Queued

  const identity = await get(context.store, Identity, call.who)
  final.identity = identity

  await context.store.save(final)
}
