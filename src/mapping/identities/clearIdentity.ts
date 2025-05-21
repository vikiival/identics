import { logger } from '@kodadot1/metasquid/logger'
import { Identity } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Action, Context } from '../../utils/types'
import { getSetAccountCall } from '../getters'

const OPERATION = Action.CLEAR

/**
 * Handle the identity clear call (Identity.clear_identity)
 * Marks an Identity as cleared
 * @param context - the context for the Call
 */
export async function handleIdentityClear(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getSetAccountCall)
  debug(OPERATION, event)

  success(OPERATION, `OK`)
}
