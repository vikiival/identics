import { getOrCreate } from '@kodadot1/metasquid/entity'

import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Action, Context } from '../../utils/types'
import {
  getAddSubCall,
  getRemoveDanglingUsernameEvent,
  getSetIdentityCall,
  getSetSubsCall,
} from '../getters'
import { Identity, Username, UsernameStatus } from '../../model'

const OPERATION = `CALL::USERNAME_REMOVE_DANGLING`

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleDanglingUsernameRemove(
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
