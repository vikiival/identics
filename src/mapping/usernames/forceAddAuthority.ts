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
export async function handleUsernameAuthorityForceAdd(
  context: Pick<Context, 'block' | 'store'>
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context as any, (ctx: Context) => ({
    origin: ChainOrigin.PEOPLE,
    authority: '152Rg99tAkt8BM3H9VcV88dxWys2WpZQ8r3LuVyAUozmzcv7',
    allocation: 999658,
    suffix: 'dot',
  }))
  debug(OPERATION, call, true)

  const id = call.authority

  const authority = await getOrCreate(context.store, Authority, id, {})
  authority.address = call.authority
  authority.suffix = call.suffix
  authority.allocation = call.allocation ?? 0
  authority.createdAt = call.timestamp
  authority.updatedAt = call.timestamp
  authority.origin = call.origin || ChainOrigin.PEOPLE
  authority.blockNumber = BigInt(call.blockNumber)

  success(OPERATION, `${id}/${call.suffix}`)
  await context.store.save(authority)
}
