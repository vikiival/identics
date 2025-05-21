import { unwrap } from '../../utils/extract'
import { debug, pending } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getRemoveSubCall } from '../getters'

const OPERATION = `CALL::REMOVE_SUB` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleSubRemove(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getRemoveSubCall)
  debug(OPERATION, call)

  const id = call.caller
  // const final = await getOrCreate(context.store, Identity, id, {})

  // Set properties from basic
  // final.blockNumber = BigInt(call.blockNumber)
  // final.createdAt = call.timestamp
  // final.updatedAt = call.timestamp

  // Set properties from IdentityInfo
  // final.name = call.display
  // final.legal = call.legal
  // final.web = call.web
  // final.matrix = call.matrix
  // final.email = call.email
  // final.image = call.image
  // final.twitter = call.twitter
  // final.github = call.github
  // final.discord = call.discord

  // success(OPERATION, `[COLLECTION] ${final.id}`)
  // await context.store.save(final)

  console.log(`Identity set to: ${id}`)
}
