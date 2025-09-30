import { create, findOneWithJoin } from '@kodadot1/metasquid/entity'
import { Identity, Sub, Event } from '../../model'
import { unwrap } from '../../utils/extract'
import { pending, skip, success } from '../../utils/logger'
import { Action, Context } from '../../utils/types'
import { getIdentityClearedEvent } from '../getters'
import md5 from 'md5'
import { serializer } from '@kodadot1/metasquid'

const OPERATION = Action.CLEAR

/**
 * Handle the identity clear call (Identity.clear_identity)
 * Marks an Identity as cleared
 * @param context - the context for the Call
 */
export async function handleIdentityClear(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getIdentityClearedEvent)

  const id = event.who
  const final = await findOneWithJoin(context.store, Identity, id, {
    subs: true,
  })

  if (!final) {
    skip(OPERATION, `Identity not found: ${id}`)
    return
  }

  const meta = JSON.stringify(final, serializer)

  final.burned = true
  final.updatedAt = event.timestamp
  final.registrar = undefined
  final.judgement = undefined
  final.hash = undefined

  const subCount = final.subs.length

  if (subCount) {
    await context.store.remove(
      Sub,
      final.subs.map((sub) => sub.id)
    )
  }

  await context.store.save(final)
  success(OPERATION, `${id}/${subCount}`)

  const eventId = md5(
    `${OPERATION}-${Math.random()}-${process.env.CHAIN}-${
      context.block.height
    }-${event.caller}`
  )
  const interaction = create(Event, eventId, {
    blockNumber: BigInt(context.block.height),
    timestamp: event.timestamp,
    caller: event.caller,
    currentOwner: event.caller,
    interaction: OPERATION,
    identity: final,
    meta,
  })
  await context.store.save(interaction)
}
