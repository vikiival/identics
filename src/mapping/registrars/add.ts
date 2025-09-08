import { create } from '@kodadot1/metasquid/entity'
import { Registrar } from '../../model'

import { unwrap } from '../../utils/extract'
import { addressOf } from '../../utils/helper'
import { debug, pending, success } from '../../utils/logger'
import { Context } from '../../utils/types'
import { getRegistrarAddedEvent, getRegistrarStorageInfo } from '../getters'

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
  debug(OPERATION, event, true)

  const storageAccess = getRegistrarStorageInfo()
  const storageInfo = await storageAccess
    .get(context.block as any)
    .then((info: any) => (info || []).filter(Boolean))
  debug(OPERATION, storageInfo || {}, true)

  const info = storageInfo.at(event.index)

  if (!info) {
    throw new Error(`No registrar info found at index ${event.index}`)
  }

  const id = event.index.toString()
  const final = create(Registrar, id, {
    address: addressOf(info.account),
    blockNumber: BigInt(event.blockNumber),
    createdAt: event.timestamp,
    updatedAt: event.timestamp,
    fee: BigInt(info.fee),
    field: BigInt(info.fields),
    origin: event.origin,
  })

  success(OPERATION, `${final.id}/${final.address}`)
  await context.store.save(final)
}
