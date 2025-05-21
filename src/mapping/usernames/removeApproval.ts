import { get } from '@kodadot1/metasquid/entity'
import { Username } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getRemoveExpiredApprovalCall } from '../getters'

const OPERATION = `CALL::AUTH_REMOVE`

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleExpiredApprovalRemove(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getRemoveExpiredApprovalCall)

  debug(OPERATION, call)

  const id = call.username
  const final = await get(context.store, Username, id)

  if (final) {
    await context.store.remove(final)
  }

  success(OPERATION, `${id}/${call.caller}`)
}
