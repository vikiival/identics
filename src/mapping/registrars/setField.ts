import { getOrCreate } from '@kodadot1/metasquid/entity'

import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Action, Context } from '../../utils/types'
import { getSetFeeCall } from '../getters'
import { Identity } from '../../model'

const OPERATION = `CALL::SET_FIELDS`

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleFieldSet(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getSetFeeCall)
  debug(OPERATION, event)

  success(OPERATION, `OK`)
  // await context.store.save(final)
}
