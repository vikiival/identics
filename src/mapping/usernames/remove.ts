import { get, getOrCreate } from '@kodadot1/metasquid/entity'

import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Action, Context } from '../../utils/types'
import {
  getAddSubCall,
  getSetIdentityCall,
  getSetSubsCall,
  getUsernameRemoveEvent,
  getUsernameSetEvent,
} from '../getters'
import { Identity, Username } from '../../model'

const OPERATION = `CALL::SET_USERNAME` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleUsernameRemove(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getUsernameRemoveEvent)
  debug(OPERATION, event)

  const id = event.username
  const final = await getOrCreate(context.store, Username, id, {})

  await context.store.remove(final)
  success(OPERATION, `${event.username}/${id}`)
}
