import { get, getOrCreate } from '@kodadot1/metasquid/entity'

import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Action, Context } from '../../utils/types'
import {
  getAddSubCall,
  getSetIdentityCall,
  getSetSubsCall,
  getUsernameSetEvent,
} from '../getters'
import { Identity, Username, UsernameStatus } from '../../model'

const OPERATION = `CALL::SET_USERNAME` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleUsernameSet(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getUsernameSetEvent)
  debug(OPERATION, event)

  const id = event.username
  const final = await getOrCreate(context.store, Username, id, {})

  final.createdAt = event.timestamp
  final.primary = false
  final.name = event.username
  final.status = UsernameStatus.Active

  const identity = await get(context.store, Identity, event.who)
  final.identity = identity

  await context.store.save(final)
}
