import { unwrap } from '../../utils/extract'
import { debug, pending } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getRemoveUsernameAuthorityCall } from '../getters'

const OPERATION = `CALL::AUTH_REMOVE` //Action.CREATE

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
export async function handleUsernameAuthorityRemove(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getRemoveUsernameAuthorityCall)
  debug(OPERATION, call)

  const id = call.caller
  // const final = await getOrCreate(context.store, Identity, id, {})

  console.log(`Identity set to: ${id}`)
}
