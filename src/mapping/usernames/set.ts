import { getOrCreate } from '@kodadot1/metasquid/entity'

import { unwrap } from '../../../utils/extract'
import { debug, pending, success } from '../../../utils/logger'
import { Action, Context } from '../../../utils/types'
import {
  getAddSubCall,
  getRemoveUsernameAuthorityCall,
  getSetIdentityCall,
  getSetSubsCall,
} from '../../getters'
import { Identity } from '../../../model'

const OPERATION = `CALL::ADD_SUB` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleUsernameSet(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getRemoveUsernameAuthorityCall)
  debug(OPERATION, call)

  const id = call.caller
  // const final = await getOrCreate(context.store, Identity, id, {})

  console.log(`Identity set to: ${id}`)
}
