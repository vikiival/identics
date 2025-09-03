import { ChainOrigin } from '../../model'
import { identity as calls } from '../../types/polkadot/calls'
import { identity as events } from '../../types/polkadot/events'
import {
  Data,
  Data_BlakeTwo256,
  Data_Keccak256,
  Data_None,
  Data_Sha256,
  Data_ShaThree256,
  MultiAddress,
} from '../../types/polkadot/v9110'
import { addressOf, unHex } from '../../utils/helper'
import { debug } from '../../utils/logger'
import { Context } from '../../utils/types'

// UTILITY
function fromData(data: Data): string | undefined {
  if (isEmpty(data)) {
    return undefined
  }

  if (isHashed(data)) {
    return data.value
  }

  // https://brandur.org/fragments/invalid-byte-sequence
  if (data.value.startsWith('0x00')) {
    return undefined
  }

  return unHex(data.value)
}

function isHashed(
  data: Data
): data is Data_BlakeTwo256 | Data_Keccak256 | Data_ShaThree256 | Data_Sha256 {
  return ['BlakeTwo256', 'Keccak256', 'ShaThree256', 'Sha256'].includes(
    data.__kind
  )
}

function isEmpty<T>(data: Data): data is Data_None {
  return data.__kind === 'None'
}

function subFrom(
  sub: MultiAddress,
  data: Data
): { address: string; data: string | undefined; origin: ChainOrigin } {
  return {
    address: fromMulticall(sub) as string,
    data: fromData(data),
    origin: ChainOrigin.RELAY,
  }
}

function fromMulticall(ma: MultiAddress) {
  if (ma.__kind === 'Index') {
    return null
  }

  if (ma.__kind === 'Address20') {
    return ma.value
  }

  debug(`CALL::fromMulticall::${ma.__kind}`, ma)
  return addressOf(ma.value)
}

// GETTERS

export function getSetIdentityCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.setIdentity
  if (call.v5.is(ctx)) {
    const { info } = call.v5.decode(ctx)
    return {
      display: fromData(info.display),
      legal: fromData(info.legal),
      web: fromData(info.web),
      email: fromData(info.email),
      matrix: fromData(info.riot), // riot is the equivalent of matrix in v5
      image: fromData(info.image),
      twitter: fromData(info.twitter),
      github: undefined, // not available in polkadot v5
      discord: undefined, // not available in polkadot v5
      origin: ChainOrigin.RELAY,
    }
  }

  // warn(Interaction.CREATE, 'USING UNSAFE GETTER! PLS UPDATE TYPES!')
  const { info } = call.v5.decode(ctx)
  return {
    display: fromData(info.display),
    legal: fromData(info.legal),
    web: fromData(info.web),
    email: fromData(info.email),
    matrix: fromData(info.riot), // riot is the equivalent of matrix in v5
    image: fromData(info.image),
    twitter: fromData(info.twitter),
    github: undefined, // not available in polkadot v5
    discord: undefined, // not available in polkadot v5
    origin: ChainOrigin.RELAY,
  }
}

export function getProvideJudgementCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.provideJudgement
  if (call.v5.is(ctx)) {
    const { regIndex, target, judgement } = call.v5.decode(ctx)
    return {
      registrarId: regIndex,
      target: fromLookupSource(target),
      judgement: judgement.__kind,
      checksum: undefined,
    }
  }
  if (call.v28.is(ctx)) {
    const { regIndex, target, judgement } = call.v28.decode(ctx)
    return {
      registrarId: regIndex,
      target: fromLookupSource(target),
      judgement: judgement.__kind,
      checksum: undefined,
    }
  }
  if (call.v9110.is(ctx)) {
    const { regIndex, target, judgement } = call.v9110.decode(ctx)
    return {
      registrarId: regIndex,
      target: fromMulticall(target) as string,
      judgement: judgement.__kind,
      checksum: undefined,
    }
  }
  if (call.v9300.is(ctx)) {
    const { regIndex, target, judgement, identity } = call.v9300.decode(ctx)
    return {
      registrarId: regIndex,
      target: fromMulticall(target) as string,
      judgement: judgement.__kind,
      checksum: identity,
    }
  }
  const { regIndex, target, judgement, identity } = call.v9300.decode(ctx)
  return {
    registrarId: regIndex,
    target: fromMulticall(target) as string,
    judgement: judgement.__kind,
    checksum: identity,
  }
}

export function getRequestJudgementCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.requestJudgement
  if (call.v5.is(ctx)) {
    const { regIndex, maxFee } = call.v5.decode(ctx)
    return {
      registrarId: regIndex,
      maxFee,
    }
  }

  const { regIndex, maxFee } = call.v5.decode(ctx)
  return {
    registrarId: regIndex,
    maxFee,
  }
}

export function getCancelRequestCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.cancelRequest
  if (call.v5.is(ctx)) {
    const { regIndex } = call.v5.decode(ctx)
    return {
      registrarId: regIndex,
    }
  }

  const { regIndex } = call.v5.decode(ctx)
  return {
    registrarId: regIndex,
  }
}

function fromLookupSource(source: any): string {
  if (typeof source === 'string') {
    return source
  }
  if (source.__kind === 'Id') {
    return addressOf(source.value)
  }
  if (source.__kind === 'Address20') {
    return source.value
  }
  if (source.__kind === 'Address32') {
    return source.value
  }
  return addressOf(source)
}

export function getAddSubCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.addSub
  if (call.v15.is(ctx)) {
    const { sub, data } = call.v15.decode(ctx)
    return { address: fromLookupSource(sub), data: fromData(data) }
  }
  if (call.v28.is(ctx)) {
    const { sub, data } = call.v28.decode(ctx)
    return { address: fromLookupSource(sub), data: fromData(data) }
  }
  if (call.v9110.is(ctx)) {
    const { sub, data } = call.v9110.decode(ctx)
    return subFrom(sub, data)
  }
  const { sub, data } = call.v9110.decode(ctx)
  return subFrom(sub, data)
}

export function getSetSubsCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.setSubs
  if (call.v5.is(ctx)) {
    const { subs } = call.v5.decode(ctx)
    return {
      subs: subs.map(([addr, data]) => ({
        address: addressOf(addr),
        data: fromData(data) || undefined,
        origin: ChainOrigin.RELAY, // Default origin for relay chain
      })),
    }
  }
  const { subs } = call.v5.decode(ctx)
  return {
    subs: subs.map(([addr, data]) => ({
      address: addressOf(addr),
      data: fromData(data) || undefined,
      origin: ChainOrigin.RELAY, // Default origin for relay chain
    })),
  }
}

export function getRenameSubCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.renameSub
  if (call.v15.is(ctx)) {
    const { sub, data } = call.v15.decode(ctx)
    return { address: fromLookupSource(sub), data: fromData(data) }
  }
  if (call.v28.is(ctx)) {
    const { sub, data } = call.v28.decode(ctx)
    return { address: fromLookupSource(sub), data: fromData(data) }
  }
  if (call.v9110.is(ctx)) {
    const { sub, data } = call.v9110.decode(ctx)
    return subFrom(sub, data)
  }
  const { sub, data } = call.v9110.decode(ctx)
  return subFrom(sub, data)
}

export function getRemoveSubCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.removeSub
  if (call.v15.is(ctx)) {
    const { sub } = call.v15.decode(ctx)
    return { address: fromLookupSource(sub) }
  }
  if (call.v28.is(ctx)) {
    const { sub } = call.v28.decode(ctx)
    return { address: fromLookupSource(sub) }
  }
  if (call.v9110.is(ctx)) {
    const { sub } = call.v9110.decode(ctx)
    return { address: fromMulticall(sub) }
  }
  const { sub } = call.v9110.decode(ctx)
  return { address: fromMulticall(sub) }
}

export function getAddUsernameAuthorityCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.addUsernameAuthority
  // This call doesn't exist in polkadot identity pallet
  return { authority: '', suffix: '', allocation: 0 }
}

export function getRemoveUsernameAuthorityCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.removeUsernameAuthority
  // This call doesn't exist in polkadot identity pallet
  return { authority: '', suffix: '' }
}

// OK Events
export function getIdentityClearedEvent(_ctx: Context) {
  const ctx = _ctx.event
  const event = events.identityCleared
  if (event.v5.is(ctx)) {
    const [who] = event.v5.decode(ctx)
    return { who: addressOf(who) }
  }
  if (event.v9140.is(ctx)) {
    const { who } = event.v9140.decode(ctx)
    return { who: addressOf(who) }
  }
  const { who } = event.v9140.decode(ctx)
  return { who: addressOf(who) }
}

export function getIdentityKilledEvent(_ctx: Context) {
  const ctx = _ctx.event
  const event = events.identityKilled
  if (event.v5.is(ctx)) {
    const [who] = event.v5.decode(ctx)
    return { who: addressOf(who) }
  }
  if (event.v9140.is(ctx)) {
    const { who } = event.v9140.decode(ctx)
    return { who: addressOf(who) }
  }
  const { who } = event.v9140.decode(ctx)
  return { who: addressOf(who) }
}

export function getSubIdentityRemovedEvent(_ctx: Context) {
  const ctx = _ctx.event
  const event = events.subIdentityRemoved
  if (event.v15.is(ctx)) {
    const [sub, main] = event.v15.decode(ctx)
    return { sub: addressOf(sub), main: addressOf(main) }
  }
  if (event.v9140.is(ctx)) {
    const { sub, main } = event.v9140.decode(ctx)
    return { sub: addressOf(sub), main: addressOf(main) }
  }
  const { sub, main } = event.v9140.decode(ctx)
  return { sub: addressOf(sub), main: addressOf(main) }
}

export function getSubIdentityAddEvent(_ctx: Context) {
  const ctx = _ctx.event
  const event = events.subIdentityAdded
  if (event.v15.is(ctx)) {
    const [sub, main] = event.v15.decode(ctx)
    return { sub: addressOf(sub), main: addressOf(main) }
  }
  if (event.v9140.is(ctx)) {
    const { sub, main } = event.v9140.decode(ctx)
    return { sub: addressOf(sub), main: addressOf(main) }
  }
  const { sub, main } = event.v9140.decode(ctx)
  return { sub: addressOf(sub), main: addressOf(main) }
}

export function getSubIdentityRevokedEvent(_ctx: Context) {
  const ctx = _ctx.event
  const event = events.subIdentityRevoked
  if (event.v15.is(ctx)) {
    const [sub, main] = event.v15.decode(ctx)
    return { sub: addressOf(sub), main: addressOf(main) }
  }
  if (event.v9140.is(ctx)) {
    const { sub, main } = event.v9140.decode(ctx)
    return { sub: addressOf(sub), main: addressOf(main) }
  }
  const { sub, main } = event.v9140.decode(ctx)
  return { sub: addressOf(sub), main: addressOf(main) }
}

export function getUsernameSetEvent(_ctx: Context) {
  const ctx = _ctx.event
  // Username events don't exist in polkadot identity pallet
  return { who: '', username: '' }
}

export function getUsernameQueuedEvent(_ctx: Context) {
  const ctx = _ctx.event
  // Username events don't exist in polkadot identity pallet
  return { who: '', username: '', expiration: 0 }
}

export function getPreapprovalExpiredEvent(_ctx: Context) {
  const ctx = _ctx.event
  // Username events don't exist in polkadot identity pallet
  return { who: '' }
}

export function getPrimaryUsernameSetEvent(_ctx: Context) {
  const ctx = _ctx.event
  // Username events don't exist in polkadot identity pallet
  return { who: '', username: '' }
}

export function getUsernameRemoveEvent(_ctx: Context) {
  const ctx = _ctx.event
  // Username events don't exist in polkadot identity pallet
  return { username: '' }
}

export function getUsernameKillEvent(_ctx: Context) {
  const ctx = _ctx.event
  // Username events don't exist in polkadot identity pallet
  return { username: '' }
}

export function getUsernameUnbindEvent(_ctx: Context) {
  const ctx = _ctx.event
  // Username events don't exist in polkadot identity pallet
  return { username: '' }
}

// DOABLE Events
export function getJudgementRequestedEvent(_ctx: Context) {
  const ctx = _ctx.event
  const event = events.judgementRequested
  if (event.v5.is(ctx)) {
    const [who, registrar] = event.v5.decode(ctx)
    return { who: addressOf(who), registrar }
  }
  if (event.v9140.is(ctx)) {
    const { who, registrarIndex: registrar } = event.v9140.decode(ctx)
    return { who: addressOf(who), registrar }
  }
  const { who, registrarIndex: registrar } = event.v9140.decode(ctx)
  return { who: addressOf(who), registrar }
}

export function getJudgementUnrequestedEvent(_ctx: Context) {
  const ctx = _ctx.event
  const event = events.judgementUnrequested
  if (event.v5.is(ctx)) {
    const [who, registrar] = event.v5.decode(ctx)
    return { who: addressOf(who), registrar }
  }
  if (event.v9140.is(ctx)) {
    const { who, registrarIndex: registrar } = event.v9140.decode(ctx)
    return { who: addressOf(who), registrar }
  }
  const { who, registrarIndex: registrar } = event.v9140.decode(ctx)
  return { who: addressOf(who), registrar }
}

export function getRemoveDanglingUsernameEvent(_ctx: Context) {
  const ctx = _ctx.event
  // Username events don't exist in polkadot identity pallet
  return { who: '', username: '' }
}

export function getSetFeeCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.setFee
  if (call.v5.is(ctx)) {
    const { index, fee } = call.v5.decode(ctx)
    return { index, fee }
  }
  const { index, fee } = call.v5.decode(ctx)
  return { index, fee }
}

export function getSetFieldCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.setFields
  if (call.v5.is(ctx)) {
    const { index, fields } = call.v5.decode(ctx)
    return { index, fields }
  }
  const { index, fields } = call.v5.decode(ctx)
  return { index, fields }
}

export function getSetAccountCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.setAccountId
  if (call.v5.is(ctx)) {
    const { index, new: account } = call.v5.decode(ctx)
    return { index, account: addressOf(account) }
  }
  if (call.v9291.is(ctx)) {
    const { index, new: account } = call.v9291.decode(ctx)
    return { index, account: fromMulticall(account) as string }
  }
  const { index, new: account } = call.v9291.decode(ctx)
  return { index, account: fromMulticall(account) as string }
}

export function getRegistrarAddedEvent(_ctx: Context) {
  const ctx = _ctx.event
  const event = events.registrarAdded
  if (event.v5.is(ctx)) {
    const index = event.v5.decode(ctx)
    return { index }
  }
  if (event.v9140.is(ctx)) {
    const { registrarIndex: index } = event.v9140.decode(ctx)
    return { index }
  }
  const { registrarIndex: index } = event.v9140.decode(ctx)
  return { index }
}

export function getRemoveExpiredApprovalCall(_ctx: Context) {
  const ctx = _ctx.call
  // Username calls don't exist in polkadot identity pallet
  return { username: '' }
}

export function getAddRegistrarCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.addRegistrar
  if (call.v5.is(ctx)) {
    const { account } = call.v5.decode(ctx)
    return { account: addressOf(account) }
  }
  if (call.v9291.is(ctx)) {
    const { account } = call.v9291.decode(ctx)
    return { account: fromMulticall(account) as string }
  }
  const { account } = call.v9291.decode(ctx)
  return { account: fromMulticall(account) as string }
}
