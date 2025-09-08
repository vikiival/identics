import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v1002006 from '../v1002006'
import * as v1005001 from '../v1005001'

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

export const authorityOf =  {
    /**
     *  A map of the accounts who are authorized to grant usernames.
     */
    v1005001: new StorageType('Identity.AuthorityOf', 'Optional', [sts.bytes()], v1005001.AuthorityProperties) as AuthorityOfV1005001,
}

/**
 *  A map of the accounts who are authorized to grant usernames.
 */
export interface AuthorityOfV1005001  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: Bytes): Promise<(v1005001.AuthorityProperties | undefined)>
    getMany(block: Block, keys: Bytes[]): Promise<(v1005001.AuthorityProperties | undefined)[]>
    getKeys(block: Block): Promise<Bytes[]>
    getKeys(block: Block, key: Bytes): Promise<Bytes[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<Bytes[]>
    getKeysPaged(pageSize: number, block: Block, key: Bytes): AsyncIterable<Bytes[]>
    getPairs(block: Block): Promise<[k: Bytes, v: (v1005001.AuthorityProperties | undefined)][]>
    getPairs(block: Block, key: Bytes): Promise<[k: Bytes, v: (v1005001.AuthorityProperties | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: Bytes, v: (v1005001.AuthorityProperties | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: Bytes): AsyncIterable<[k: Bytes, v: (v1005001.AuthorityProperties | undefined)][]>
}
