import { get } from '@kodadot1/metasquid/entity'
import { Identity } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getJudgementRequestedEvent } from '../getters'

const OPERATION = `EVENT::JUDGEMENT_REQUEST` //Action.CREATE

/**
 * Handle the identity create call (Identity.request_judgement)
 * Creates a request of judgement fro a given Identity
 * Logs EVENT::JUDGEMENT_REQUEST event
 * @param context - the context for the Call
 */
export async function handleJudgementRequest(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getJudgementRequestedEvent)
  debug(OPERATION, event)

  const id = event.who
  const final = await get(context.store, Identity, id)

  if (!final) {
    skip(OPERATION, `Identity not found: ${id}`)
    return
  }

  final.registrar = event.registrar

  success(OPERATION, `${final.id}/${final.registrar}`)
  await context.store.save(final)
}
