import { get } from '@kodadot1/metasquid/entity'
import { Registrar } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getSetAccountCall } from '../getters'

const OPERATION = `CALL::SET_ACCOUNT`

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleAccountIdSet(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getSetAccountCall)
  debug(OPERATION, call)

  const id = call.index.toString()
  const final = await get(context.store, Registrar, id)

  if (!final) {
    skip(OPERATION, `Registrar not found: ${id}`)
    return
  }

  final.address = call.account
  final.updatedAt = call.timestamp

  success(OPERATION, `${final.id}/${final.address}`)
  await context.store.save(final)
}
