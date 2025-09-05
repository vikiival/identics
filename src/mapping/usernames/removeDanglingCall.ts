import { getOrCreate } from '@kodadot1/metasquid/entity'

import { Username, UsernameStatus } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getRemoveDanglingUsernameEvent } from '../getters'

const OPERATION = `EVENT::USERNAME_REMOVE_DANGLING`

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleDanglingUsernameRemoveCall(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getRemoveDanglingUsernameEvent)
  debug(OPERATION, event)

  const id = event.username
  const final = await getOrCreate(context.store, Username, id, {})

  final.status = UsernameStatus.Removed

  await context.store.save(final)
  success(OPERATION, `${event.who}/${id}`)
}
