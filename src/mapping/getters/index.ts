import { identity as calls } from '../../types/people/calls'
import { identity as events } from '../../types/people/events'
import { Data, Data_None, MultiAddress } from '../../types/people/v1002006'
import { addressOf, unHex } from '../../utils/helper'
import { debug } from '../../utils/logger'
import { Context } from '../../utils/types'

// UTILITY
function fromData(data: Data): string | undefined {
  if (isEmpty(data)) return undefined
  return unHex(data.value)
}

function isEmpty<T>(data: Data): data is Data_None {
  return data.__kind === 'None'
}

function subFrom(
  sub: MultiAddress,
  data: Data
): { address: string; data: string | undefined } {
  return { address: fromMulticall(sub) as string, data: fromData(data) }
}

// GETTERS

export function getSetIdentityCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.setIdentity
  if (call.v1002006.is(ctx)) {
    const { info } = call.v1002006.decode(ctx)
    return {
      display: fromData(info.display),
      legal: fromData(info.legal),
      web: fromData(info.web),
      email: fromData(info.email),
      matrix: fromData(info.matrix),
      image: fromData(info.image),
      twitter: fromData(info.twitter),
      github: fromData(info.github),
      discord: fromData(info.discord),
    }
  }

  // warn(Interaction.CREATE, 'USING UNSAFE GETTER! PLS UPDATE TYPES!')
  const { info } = call.v1002006.decode(ctx)
  return {
    display: fromData(info.display),
    legal: fromData(info.legal),
    web: fromData(info.web),
    email: fromData(info.email),
    matrix: fromData(info.matrix),
    image: fromData(info.image),
    twitter: fromData(info.twitter),
    github: fromData(info.github),
    discord: fromData(info.discord),
  }
}

function fromMulticall(ma: MultiAddress) {
  if (ma.__kind === 'Index') {
    return null
  }

  debug(`CALL::fromMulticall::${ma.__kind}`, ma)
  return addressOf(ma.value)
}

export function getProvideJudgementCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.provideJudgement
  if (call.v1002006.is(ctx)) {
    const { regIndex, target, judgement, identity } = call.v1002006.decode(ctx)
    return {
      registrarId: regIndex,
      target: fromMulticall(target) as string,
      judgement: judgement.__kind,
      checksum: identity,
    }
  }
  const { regIndex, target, judgement, identity } = call.v1002006.decode(ctx)
  return {
    registrarId: regIndex,
    target: fromMulticall(target) as string,
    judgement: judgement.__kind,
    checksum: identity,
  }
}

export function getAddSubCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.addSub
  if (call.v1002006.is(ctx)) {
    const { sub, data } = call.v1002006.decode(ctx)
    return subFrom(sub, data)
  }
  const { sub, data } = call.v1002006.decode(ctx)
  return subFrom(sub, data)
}

export function getSetSubsCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.setSubs
  if (call.v1002006.is(ctx)) {
    const { subs } = call.v1002006.decode(ctx)
    return {
      subs: subs.map(([addr, data]) => ({
        address: addressOf(addr),
        data: fromData(data) || undefined,
      })),
    }
  }
  const { subs } = call.v1002006.decode(ctx)
  return {
    subs: subs.map(([addr, data]) => ({
      address: addressOf(addr),
      data: fromData(data) || undefined,
    })),
  }
}

export function getRenameSubCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.renameSub
  if (call.v1002006.is(ctx)) {
    const { sub, data } = call.v1002006.decode(ctx)
    return subFrom(sub, data)
  }
  const { sub, data } = call.v1002006.decode(ctx)
  return subFrom(sub, data)
}

export function getRemoveSubCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.removeSub
  if (call.v1002006.is(ctx)) {
    const { sub } = call.v1002006.decode(ctx)
    return { address: fromMulticall(sub) }
  }
  const { sub } = call.v1002006.decode(ctx)
  return { address: fromMulticall(sub) }
}

export function getAddUsernameAuthorityCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.addUsernameAuthority
  if (call.v1002006.is(ctx)) {
    const { authority, suffix, allocation } = call.v1002006.decode(ctx)
    return { authority: fromMulticall(authority) as string, suffix, allocation }
  }
  const { authority, suffix, allocation } = call.v1002006.decode(ctx)
  return { authority: fromMulticall(authority) as string, suffix, allocation }
}

export function getRemoveUsernameAuthorityCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.removeUsernameAuthority
  if (call.v1002006.is(ctx)) {
    const { authority } = call.v1002006.decode(ctx)
    return { authority: fromMulticall(authority) as string, suffix: '' }
  }
  const { authority } = call.v1002006.decode(ctx)
  return { authority: fromMulticall(authority) as string, suffix: '' }
}

// OK Events
export function getIdentityClearedEvent(_ctx: Context) {
  const ctx = _ctx.call
  const event = events.identityCleared
  if (event.v1002006.is(ctx)) {
    const { who } = event.v1002006.decode(ctx)
    return { who: addressOf(who) }
  }
  const { who } = event.v1002006.decode(ctx)
  return { who: addressOf(who) }
}

export function getIdentityKilledEvent(_ctx: Context) {
  const ctx = _ctx.call
  const event = events.identityKilled
  if (event.v1002006.is(ctx)) {
    const { who } = event.v1002006.decode(ctx)
    return { who: addressOf(who) }
  }
  const { who } = event.v1002006.decode(ctx)
  return { who: addressOf(who) }
}

export function getSubIdentityRemovedEvent(_ctx: Context) {
  const ctx = _ctx.call
  const event = events.subIdentityRemoved
  if (event.v1002006.is(ctx)) {
    const { sub, main } = event.v1002006.decode(ctx)
    return { sub: addressOf(sub), main: addressOf(main) }
  }
  const { sub, main } = event.v1002006.decode(ctx)
  return { sub: addressOf(sub), main: addressOf(main) }
}

export function getSubIdentityRevokedEvent(_ctx: Context) {
  const ctx = _ctx.call
  const event = events.subIdentityRevoked
  if (event.v1002006.is(ctx)) {
    const { sub, main } = event.v1002006.decode(ctx)
    return { sub: addressOf(sub), main: addressOf(main) }
  }
  const { sub, main } = event.v1002006.decode(ctx)
  return { sub: addressOf(sub), main: addressOf(main) }
}

export function getUsernameSetEvent(_ctx: Context) {
  const ctx = _ctx.call
  const event = events.usernameSet
  if (event.v1002006.is(ctx)) {
    const { who, username } = event.v1002006.decode(ctx)
    return { who: addressOf(who), username }
  }
  const { who, username } = event.v1002006.decode(ctx)
  return { who: addressOf(who), username }
}

export function getUsernameQueuedEvent(_ctx: Context) {
  const ctx = _ctx.call
  const event = events.usernameQueued
  if (event.v1002006.is(ctx)) {
    const { who, username, expiration } = event.v1002006.decode(ctx)
    return { who: addressOf(who), username, expiration }
  }
  const { who, username, expiration } = event.v1002006.decode(ctx)
  return { who: addressOf(who), username, expiration }
}

export function getPreapprovalExpiredEvent(_ctx: Context) {
  const ctx = _ctx.call
  const event = events.preapprovalExpired
  if (event.v1002006.is(ctx)) {
    const { whose: who } = event.v1002006.decode(ctx)
    return { who: addressOf(who) }
  }
  const { whose: who } = event.v1002006.decode(ctx)
  return { who: addressOf(who) }
}

export function getPrimaryUsernameSetEvent(_ctx: Context) {
  const ctx = _ctx.call
  const event = events.primaryUsernameSet
  if (event.v1002006.is(ctx)) {
    const { who, username } = event.v1002006.decode(ctx)
    return { who: addressOf(who), username }
  }
  const { who, username } = event.v1002006.decode(ctx)
  return { who: addressOf(who), username }
}

export function getUsernameRemoveEvent(_ctx: Context) {
  const ctx = _ctx.call
  return { username: '' }
  // const event = events.usernameRemoved
  // if (event.v1002006.is(ctx)) {
  //   const { username } = event.v1002006.decode(ctx)
  //   return { username }
  // }
  // const { username } = event.v1002006.decode(ctx)
  // return { username }
}

export function getUsernameKillEvent(_ctx: Context) {
  const ctx = _ctx.event
  // Uncomment once the event is available in types
  // const event = events.usernameKilled
  // if (event.v1002006.is(ctx)) {
  //     const { username } = event.v1002006.decode(ctx)
  //     return { username }
  // }
  //     const { username } = event.v1002006.decode(ctx)
  //     return { username }
  return { username: '' }
}

export function getUsernameUnbindEvent(_ctx: Context) {
  const ctx = _ctx.event
  // Uncomment once the event is available in types
  // const event = events.usernameUnbound
  // if (event.v1002006.is(ctx)) {
  //     const { username } = event.v1002006.decode(ctx)
  //     return { username }
  // }
  //     const { username } = event.v1002006.decode(ctx)
  //     return { username }
  return { username: '' }
}

// DOABLE Events
export function getJudgementRequestedEvent(_ctx: Context) {
  const ctx = _ctx.event
  const event = events.judgementRequested
  if (event.v1002006.is(ctx)) {
    const { who, registrarIndex: registrar } = event.v1002006.decode(ctx)
    return { who: addressOf(who), registrar }
  }
  const { who, registrarIndex: registrar } = event.v1002006.decode(ctx)
  return { who: addressOf(who), registrar }
}

export function getJudgementUnrequestedEvent(_ctx: Context) {
  const ctx = _ctx.call
  const event = events.judgementUnrequested
  if (event.v1002006.is(ctx)) {
    const { who, registrarIndex: registrar } = event.v1002006.decode(ctx)
    return { who: addressOf(who), registrar }
  }
  const { who, registrarIndex: registrar } = event.v1002006.decode(ctx)
  return { who: addressOf(who), registrar }
}

export function getRemoveDanglingUsernameEvent(_ctx: Context) {
  const ctx = _ctx.call
  const event = events.danglingUsernameRemoved
  if (event.v1002006.is(ctx)) {
    const { who, username } = event.v1002006.decode(ctx)
    return { who: addressOf(who), username }
  }
  const { who, username } = event.v1002006.decode(ctx)
  return { who: addressOf(who), username }
}

export function getSetFeeCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.setFee
  if (call.v1002006.is(ctx)) {
    const { index, fee } = call.v1002006.decode(ctx)
    return { index, fee }
  }
  const { index, fee } = call.v1002006.decode(ctx)
  return { index, fee }
}

export function getSetFieldCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.setFields
  if (call.v1002006.is(ctx)) {
    const { index, fields } = call.v1002006.decode(ctx)
    return { index, fields }
  }
  const { index, fields } = call.v1002006.decode(ctx)
  return { index, fields }
}

export function getSetAccountCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.setAccountId
  if (call.v1002006.is(ctx)) {
    const { index, new: account } = call.v1002006.decode(ctx)
    return { index, account: fromMulticall(account) as string }
  }
  const { index, new: account } = call.v1002006.decode(ctx)
  return { index, account: fromMulticall(account) as string }
}

// export function getJudgementGivenEvent(_ctx: Context) {
//     const ctx = _ctx.event
//     const event = events.judgementGiven
//     if (event.v1002006.is(ctx)) {
//         const { target, registrarIndex: registrar } = event.v1002006.decode(ctx)
//         return { target: addressOf(target), registrar }
//     }
//     const { target, registrarIndex: registrar } = event.v1002006.decode(ctx)
//     return { target: addressOf(target), registrar }
// }

export function getRegistrarAddedEvent(_ctx: Context) {
  const ctx = _ctx.event
  const event = events.registrarAdded
  if (event.v1002006.is(ctx)) {
    const { registrarIndex: index } = event.v1002006.decode(ctx)
    return { index }
  }
  const { registrarIndex: index } = event.v1002006.decode(ctx)
  return { index }
}

// export function getSubIdentityAddedEvent(_ctx: Context) {
//     const ctx = _ctx.event
//     const event = events.subIdentityAdded
//     if (event.v1002006.is(ctx)) {
//         const { sub, main } = event.v1002006.decode(ctx)
//         return { sub: addressOf(sub), main: addressOf(main) }
//     }
//     const { sub, main } = event.v1002006.decode(ctx)
//     return { sub: addressOf(sub), main: addressOf(main) }
// }

// export function getAuthorityAddedEvent(_ctx: Context) {
//     const ctx = _ctx.event
//     const event = events.authorityAdded
//     if (event.v1002006.is(ctx)) {
//         const { authority } = event.v1002006.decode(ctx)
//         return { authority: addressOf(authority) }
//     }
//     const { authority } = event.v1002006.decode(ctx)
//     return { authority: addressOf(authority) }
// }

// export function getAuthorityRemovedEvent(_ctx: Context) {
//     const ctx = _ctx.event
//     const event = events.authorityRemoved
//     if (event.v1002006.is(ctx)) {
//         const { authority } = event.v1002006.decode(ctx)
//         return { authority: addressOf(authority) }
//     }
//     const { authority } = event.v1002006.decode(ctx)
//     return { authority: addressOf(authority) }
// }

// // Add missing call getters
// export function getQuitSubCall(_ctx: Context) {
//     const ctx = _ctx.call
//     const call = calls.quitSub
//     if (call.v1002006.is(ctx)) {
//         return {}
//     }
//     return {}
// }

// export function getClearIdentityCall(_ctx: Context) {
//     const ctx = _ctx.call
//     // Account for potential naming differences
//     // Assuming clearIdentity is the correct call name based on context
//     const call = calls.clearIdentity || calls.cancelIdentity
//     if (call && call.v1002006 && call.v1002006.is(ctx)) {
//         return {}
//     }
//     return {}
// }

// export function getKillIdentityCall(_ctx: Context) {
//     const ctx = _ctx.call
//     const call = calls.killIdentity
//     if (call && call.v1002006 && call.v1002006.is(ctx)) {
//         const { target } = call.v1002006.decode(ctx)
//         return { target: fromMulticall(target) }
//     }
//     return { target: null }
// }

export function getAddRegistrarCall(_ctx: Context) {
  const ctx = _ctx.call
  const call = calls.addRegistrar
  if (call.v1002006.is(ctx)) {
    const { account } = call.v1002006.decode(ctx)
    return { account: fromMulticall(account) as string }
  }
  const { account } = call.v1002006.decode(ctx)
  return { account: fromMulticall(account) as string }
}
