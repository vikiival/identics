import { get } from '@kodadot1/metasquid/entity'
import { Identity } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getCancelRequestCall } from '../getters'

const OPERATION = `CALL::JUDGEMENT_CANCEL`

/**
 * Handle the identity create call (Identity.cancel_request)
 * Cancels request for judgement
 * Logs CALL::JUDGEMENT_CANCEL event
 * @param context - the context for the Call
 */
export async function handleJudgementCancel(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const call = unwrap(context, getCancelRequestCall)
  debug(OPERATION, call)

  const id = call.caller
  const final = await get(context.store, Identity, id)

  if (!final) {
    skip(OPERATION, `Identity not found`)
    return
  }

  final.registrar = undefined

  success(OPERATION, `${final.id}/${call.registrarId}`)
  await context.store.save(final)
}
