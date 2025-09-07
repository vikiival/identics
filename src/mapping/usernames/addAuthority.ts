import { getOrCreate } from '@kodadot1/metasquid/entity'
import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getAddUsernameAuthorityCall } from '../getters'
import { Authority, ChainOrigin } from '../../model'

const OPERATION = `CALL::ADD_USERNAME_AUTHORITY` //Action.CREATE

/**
 * Handle the identity create call (Identity.add_username_authority)
 * Creates a new Authority entity
 * Logs CALL::ADD_USERNAME_AUTHORITY call
 * @param context - the context for the Call
 */
export async function handleUsernameAuthorityAdd(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getAddUsernameAuthorityCall)
  debug(OPERATION, call)

  const id = call.authority

  const authority = await getOrCreate(context.store, Authority, id, {})
  authority.address = call.authority
  authority.suffix = call.suffix
  authority.createdAt = call.timestamp
  authority.updatedAt = call.timestamp
  authority.origin = call.origin || ChainOrigin.PEOPLE
  authority.blockNumber = call.blockNumber

  success(OPERATION, `${id}/${call.suffix}`)
  await context.store.save(authority)
}
