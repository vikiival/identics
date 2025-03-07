import { getOrCreate } from '@kodadot1/metasquid/entity'

import { unwrap } from "../../utils/extract"
import { debug, pending, success } from "../../utils/logger"
import { Action, Context } from "../../utils/types"
import { getProvideJudgementCall, getSetIdentityCall } from "../getters"
import { create, getOrFail as get, findByIdListAsMap as getMany } from '@kodadot1/metasquid/entity'
import { Identity, Judgement } from '../../model'


const OPERATION = `CALL::JUDGEMENT` //Action.CREATE

/**
 * Handle the identity create call (Identity.set_identity)
 * Creates a new Identity entity
 * Logs Action.CREATE event
 * @param context - the context for the Call   
 **/
export async function handleJudgementProvide(context: Context): Promise<void> {
    pending(OPERATION, `${context.block.height}`)
    const call = unwrap(context, getProvideJudgementCall)
    debug(OPERATION, call)

    const id = call.caller
    // const final = await get(context.store, Identity, id)

    // final.jugdement = call.judgement as Judgement
    // final.registrar = call.registrarId
    // final.hash = call.checksum

    // Set properties from basic
    // final.blockNumber = BigInt(call.blockNumber)
    // final.createdAt = call.timestamp
    // final.updatedAt = call.timestamp

    // success(OPERATION, `${final.id}/${final.jugdement}//${final.jugdement}`)
    // await context.store.save(final)
}