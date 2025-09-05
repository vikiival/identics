import { get } from '@kodadot1/metasquid/entity'
import { Identity } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { CallWith, Context } from '../../utils/types'
import { getRequestJudgementCall } from '../getters'

const OPERATION = `EVENT::JUDGEMENT_REQUEST` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleJudgementRequestCall(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call: CallWith<any> = unwrap(context, getRequestJudgementCall)
  debug(OPERATION, call)

  const id = call.caller
  const final = await get(context.store, Identity, id)

  if (!final) {
    skip(OPERATION, `Identity not found: ${id}`)
    return
  }

  final.registrar = call.registrarId

  success(OPERATION, `${final.id}/${final.registrar}`)
  await context.store.save(final)
}
