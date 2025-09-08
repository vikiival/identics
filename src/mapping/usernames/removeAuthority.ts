import { get } from '@kodadot1/metasquid/entity'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getRemoveUsernameAuthorityCall } from '../getters'
import { Authority } from '../../model'

const OPERATION = `CALL::USERNAME_AUTH_REMOVE`

/**
 * Handle the authority removal call (Identity.remove_username_authority)
 * Removes existing Authority entity
 * Logs CALL::USERNAME_AUTH_REMOVE event
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

  const suffix = final?.suffix

  if (final) {
    await context.store.remove(final)
  }

  success(OPERATION, `${id}/${suffix}`)
}
