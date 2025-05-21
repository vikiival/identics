import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Action, Context } from '../../utils/types'
import { getRegistrarAddedEvent } from '../getters'

const OPERATION = `CALL::ADD_REGISTRAR`

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleRegistrarAdd(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getRegistrarAddedEvent)
  debug(OPERATION, event)

  success(OPERATION, `OK`)
  // await context.store.save(final)
}
