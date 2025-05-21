import { unwrap } from '../../../utils/extract'
import { debug, pending } from '../../../utils/logger'
import { Context } from '../../../utils/types'
import { getAddUsernameAuthorityCall } from '../../getters'

const OPERATION = `CALL::ADD_SUB` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleUsernameAuthorityAdd(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getAddUsernameAuthorityCall)
  debug(OPERATION, call)

  const id = call.caller

  console.log(`Identity set to: ${id}`)
}
