import {sts, Result, Option, Bytes, BitSequence} from './support'

export const RegistrarIndex = sts.number()

export const Balance = sts.bigint()

export const AccountId = sts.bytes()
