import { create, findOneWithJoin } from '@kodadot1/metasquid/entity'
import { Identity, Sub, Event } from '../../model'
import md5 from 'md5'
import { serializer } from '@kodadot1/metasquid'
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
  const call = unwrap(context, getKillIdentityCall)
  debug(OPERATION, context)

  const id = call.who
  const final = await findOneWithJoin(context.store, Identity, id, {
    subs: true,
  })

  if (!final) {
    skip(OPERATION, `Identity not found: ${id}`)
    return
  }

  const meta = JSON.stringify(final, serializer)

  final.burned = true
  final.updatedAt = call.timestamp
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
    }-${call.caller}`
  )
  const interaction = create(Event, eventId, {
    blockNumber: BigInt(context.block.height),
    timestamp: call.timestamp,
    caller: call.caller,
    currentOwner: call.caller,
    interaction: OPERATION,
    identity: final,
    meta,
  })
  await context.store.save(interaction)
}
