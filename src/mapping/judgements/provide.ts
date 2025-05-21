import { get } from '@kodadot1/metasquid/entity'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getProvideJudgementCall } from '../getters'
import { Identity, Judgement } from '../../model'

const OPERATION = `CALL::JUDGEMENT_GIVE` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleJudgementProvide(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getProvideJudgementCall)
  debug(OPERATION, call)

  const id = call.target
  const final = await get(context.store, Identity, id)

  if (!final) {
    skip(OPERATION, `Identity not found: ${id}`)
    return
  }

  final.judgement = call.judgement as Judgement
  final.registrar = call.registrarId
  final.hash = call.checksum

  final.updatedAt = call.timestamp

  success(OPERATION, `${final.judgement}/${final.id}`)
  await context.store.save(final)
}
