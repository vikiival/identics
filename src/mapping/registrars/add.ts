import { create } from '@kodadot1/metasquid/entity'
import { Registrar } from '../../model'
import { unwrap } from '../../utils/extract'
import { debug, pending, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getAddRegistrarCall, getRegistrarAddedEvent } from '../getters'

const OPERATION = `CALL::ADD_REGISTRAR`

/**
 * Handle the registrar create call (Identity.add_registrar)
 * Creates a new Registrar entity
 * Logs CALL::ADD_REGISTRAR event
 * @param context - the context for the Call
 */
export async function handleRegistrarAdd(context: Context): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context, getRegistrarAddedEvent)
  const call = unwrap(context, getAddRegistrarCall)
  debug(OPERATION, event)
  debug(OPERATION, call)

  const id = event.index.toString()
  const final = create(Registrar, id, {
    address: call.account,
    blockNumber: BigInt(event.blockNumber),
    createdAt: call.timestamp,
    updatedAt: call.timestamp,
  })

  success(OPERATION, `OK`)
  await context.store.save(final)
}
