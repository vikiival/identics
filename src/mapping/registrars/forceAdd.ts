import { create } from '@kodadot1/metasquid/entity'
import { ChainOrigin, Registrar } from '../../model'

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
export async function handleRegistrarForceAdd(
  context: Pick<Context, 'block' | 'store'>
): Promise<void> {
  pending(OPERATION, `${context.block.height}`)
  const event = unwrap(context as any, (ctx: Context) => ({
    origin: ChainOrigin.PEOPLE,
  }))
  debug(OPERATION, event, true)

  const storageAccess = getRegistrarStorageInfo()
  const storageInfo = await storageAccess
    .get(context.block as any)
    .then((info: any) => (info || []).filter(Boolean))
  debug(OPERATION, storageInfo || {}, true)

  const info = storageInfo

  if (!info.length) {
    throw new Error(`No registrar info found`)
  }
  // need index because forceAdd adds multiple registrars at once
  const finalList: Registrar[] = []
  for (const [index, item] of info.entries()) {
    const id = index.toString()
    const final = create(Registrar, id, {
      address: addressOf(item.account),
      blockNumber: BigInt(event.blockNumber),
      createdAt: event.timestamp,
      updatedAt: event.timestamp,
      fee: BigInt(item.fee),
      field: BigInt(item.fields),
      origin: event.origin,
    })
    finalList.push(final)
  }
  success(
    OPERATION,
    `${finalList.map((f) => `${f.id}/${f.address}`).join(', ')}`
  )
  await context.store.save(finalList)
}
