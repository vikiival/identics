import { findOneWithJoin } from '@kodadot1/metasquid/entity'
import { Identity, Sub } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Action, Context } from '../../utils/types'
import { getKillIdentityCall } from '../getters'

const OPERATION = Action.DESTROY

/**
 * Handle the identity clear call (Identity.clear_identity)
 * Marks an Identity as cleared
 * @param context - the context for the Call
 */
export async function handleIdentityKillCall(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getKillIdentityCall)
  debug(OPERATION, context)

  const id = event.who
  const final = await findOneWithJoin(context.store, Identity, id, {
    subs: true,
  })

  if (!final) {
    skip(OPERATION, `Identity not found: ${id}`)
    return
  }

  final.burned = true
  final.updatedAt = event.timestamp
  final.registrar = undefined
  final.judgement = undefined
  final.hash = undefined

  await context.store.remove(
    Sub,
    final.subs.map((sub) => sub.id)
  )

  success(OPERATION, `OK`)
}
