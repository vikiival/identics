import { get, getOrCreate } from '@kodadot1/metasquid/entity'

import { Identity, Username, UsernameStatus } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getSetPrimaryUsernameCall } from '../getters'

const OPERATION = `CALL::SET_USERNAME_PRIMARY`

/**
 * Handle the username set event (Identity.PrimaryUsernameSet)
 * Creates a new Username entity
 * Logs CALL::SET_USERNAME_PRIMARY event
 * @param context - the context for the Call
 */
export async function handlePrimaryUsernameSetCall(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getSetPrimaryUsernameCall)
  debug(OPERATION, call)

  const id = call.username
  const final = await getOrCreate(context.store, Username, id, {})

  final.createdAt = call.timestamp
  final.primary = true
  final.name = call.username
  final.status = UsernameStatus.Active

  const identity = await get(context.store, Identity, call.caller)
  final.identity = identity

  await context.store.save(final)
}
