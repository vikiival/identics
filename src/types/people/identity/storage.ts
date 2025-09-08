import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v1002006 from '../v1002006'

export const registrars =  {
    /**
     *  The set of registrars. Not expected to get very big as can only be added through a
     *  special origin (likely a council motion).
     * 
     *  The index into this can be cast to `RegistrarIndex` to get a valid value.
     */
    v1002006: new StorageType('Identity.Registrars', 'Default', [], sts.array(() => sts.option(() => v1002006.RegistrarInfo))) as RegistrarsV1002006,
}

/**
 *  The set of registrars. Not expected to get very big as can only be added through a
 *  special origin (likely a council motion).
 * 
 *  The index into this can be cast to `RegistrarIndex` to get a valid value.
 */
export interface RegistrarsV1002006  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): (v1002006.RegistrarInfo | undefined)[]
    get(block: Block): Promise<((v1002006.RegistrarInfo | undefined)[] | undefined)>
}
