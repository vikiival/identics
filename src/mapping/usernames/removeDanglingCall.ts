import { getOrCreate } from '@kodadot1/metasquid/entity'

import { Username, UsernameStatus } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getRemoveDanglingUsernameCall } from '../getters'

const OPERATION = `CALL::USERNAME_REMOVE_DANGLING`

/**
 * Handle the dangling username removal call (Identity.remove_dangling_username)
 * Removes existing Username entity
 * Logs CALL::USERNAME_REMOVE_DANGLING event
 * @param context - the context for the Call
 */
export async function handleDanglingUsernameRemoveCall(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getRemoveDanglingUsernameCall)
  debug(OPERATION, call)

  const id = call.username
  const final = await getOrCreate(context.store, Username, id, {})

  final.status = UsernameStatus.Removed

  await context.store.save(final)
  success(OPERATION, `${call.who}/${id}`)
}
