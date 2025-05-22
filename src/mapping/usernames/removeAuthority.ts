import { get } from '@kodadot1/metasquid/entity'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getRemoveUsernameAuthorityCall } from '../getters'
import { Authority } from '../../model'

const OPERATION = `CALL::AUTH_REMOVE`

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

  const id = call.authority
  const final = await get(context.store, Authority, id)

  if (final) {
    await context.store.remove(final)
  }

  success(OPERATION, `${id}/${call.suffix}`)
}
