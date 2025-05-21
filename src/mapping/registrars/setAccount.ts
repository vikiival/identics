import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getSetAccountCall } from '../getters'

const OPERATION = `CALL::SET_FEE`

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleAccountIdSet(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getSetAccountCall)
  debug(OPERATION, event)

  success(OPERATION, `OK`)
  // await context.store.save(final)
}
