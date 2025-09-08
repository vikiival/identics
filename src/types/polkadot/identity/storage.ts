import {
  sts,
  Block,
  Bytes,
  Option,
  Result,
  StorageType,
  RuntimeCtx,
} from '../support'
import * as v5 from '../v5'

export const registrars = {
  /**
   *  The set of registrars. Not expected to get very big as can only be added through a
   *  special origin (likely a council motion).
   *
   *  The index into this can be cast to `RegistrarIndex` to get a valid value.
   */
  v5: new StorageType(
    'Identity.Registrars',
    'Default',
    [],
    sts.array(() => sts.option(() => v5.RegistrarInfo))
  ) as RegistrarsV5,
}

/**
 *  The set of registrars. Not expected to get very big as can only be added through a
 *  special origin (likely a council motion).
 *
 *  The index into this can be cast to `RegistrarIndex` to get a valid value.
 */
export interface RegistrarsV5 {
  is(block: RuntimeCtx): boolean
  getDefault(block: Block): (v5.RegistrarInfo | undefined)[]
  get(block: Block): Promise<(v5.RegistrarInfo | undefined)[] | undefined>
}
