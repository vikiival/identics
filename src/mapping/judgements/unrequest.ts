import { get } from '@kodadot1/metasquid/entity'
import { unwrap } from '../../utils/extract'
import { debug, pending, skip, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getJudgementUnrequestedEvent } from '../getters'
import { Identity } from '../../model'

const OPERATION = `CALL::JUDGEMENT_CANCEL` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call
 */
export async function handleJudgementUnrequest(
  context: Context
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getJudgementUnrequestedEvent)
  debug(OPERATION, event)

  const id = event.who
  const final = await get(context.store, Identity, id)

  if (!final) {
    skip(OPERATION, `Identity not found`)
    return
  }

  final.registrar = undefined

  // final.jugdement = call.judgement as Judgement
  // final.registrar = call.registrarId
  // final.hash = call.checksum

  // Set properties from basic
  // final.blockNumber = BigInt(call.blockNumber)
  // final.createdAt = call.timestamp
  // final.updatedAt = call.timestamp

  success(OPERATION, `${final.id}/${event.registrar}`)
  await context.store.save(final)
}
