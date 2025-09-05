import { CHAIN } from '../../environment'
import { Context } from '../../utils/types'

// eslint-disable-next-line unicorn/prefer-module
const proc = require(`./${CHAIN}`)

export function getSetIdentityCall(_ctx: Context) {
  return proc.getSetIdentityCall(_ctx)
}

export function getKillIdentityCall(_ctx: Context) {
  return proc.getKillIdentityCall(_ctx)
}

export function getClearIdentityCall(_ctx: Context) {
  return proc.getClearIdentityCall(_ctx)
}

export function getProvideJudgementCall(_ctx: Context) {
  return proc.getProvideJudgementCall(_ctx)
}

export function getRequestJudgementCall(_ctx: Context) {
  return proc.getRequestJudgementCall(_ctx)
}

export function getCancelRequestCall(_ctx: Context) {
  return proc.getCancelRequestCall(_ctx)
}

export function getAddSubCall(_ctx: Context) {
  return proc.getAddSubCall(_ctx)
}

export function getSetSubsCall(_ctx: Context) {
  return proc.getSetSubsCall(_ctx)
}

export function getRenameSubCall(_ctx: Context) {
  return proc.getRenameSubCall(_ctx)
}

export function getRemoveSubCall(_ctx: Context) {
  return proc.getRemoveSubCall(_ctx)
}

export function getQuitSubCall(_ctx: Context) {
  return proc.getQuitSubCall(_ctx)
}

export function getAddUsernameAuthorityCall(_ctx: Context) {
  return proc.getAddUsernameAuthorityCall(_ctx)
}

export function getRemoveUsernameAuthorityCall(_ctx: Context) {
  return proc.getRemoveUsernameAuthorityCall(_ctx)
}

export function getIdentityClearedEvent(_ctx: Context) {
  return proc.getIdentityClearedEvent(_ctx)
}

export function getIdentityKilledEvent(_ctx: Context) {
  return proc.getIdentityKilledEvent(_ctx)
}

export function getSubIdentityRemovedEvent(_ctx: Context) {
  return proc.getSubIdentityRemovedEvent(_ctx)
}

export function getSubIdentityAddEvent(_ctx: Context) {
  return proc.getSubIdentityAddEvent(_ctx)
}

export function getSubIdentityRevokedEvent(_ctx: Context) {
  return proc.getSubIdentityRevokedEvent(_ctx)
}

export function getUsernameSetEvent(_ctx: Context) {
  return proc.getUsernameSetEvent(_ctx)
}

export function getUsernameQueuedEvent(_ctx: Context) {
  return proc.getUsernameQueuedEvent(_ctx)
}

export function getPreapprovalExpiredEvent(_ctx: Context) {
  return proc.getPreapprovalExpiredEvent(_ctx)
}

export function getPrimaryUsernameSetEvent(_ctx: Context) {
  return proc.getPrimaryUsernameSetEvent(_ctx)
}

export function getUsernameRemoveEvent(_ctx: Context) {
  return proc.getUsernameRemoveEvent(_ctx)
}

export function getUsernameKillEvent(_ctx: Context) {
  return proc.getUsernameKillEvent(_ctx)
}

export function getUsernameUnbindEvent(_ctx: Context) {
  return proc.getUsernameUnbindEvent(_ctx)
}

export function getJudgementRequestedEvent(_ctx: Context) {
  return proc.getJudgementRequestedEvent(_ctx)
}

export function getJudgementUnrequestedEvent(_ctx: Context) {
  return proc.getJudgementUnrequestedEvent(_ctx)
}

export function getRemoveDanglingUsernameEvent(_ctx: Context) {
  return proc.getRemoveDanglingUsernameEvent(_ctx)
}

export function getSetFeeCall(_ctx: Context) {
  return proc.getSetFeeCall(_ctx)
}

export function getSetFieldCall(_ctx: Context) {
  return proc.getSetFieldCall(_ctx)
}

export function getSetAccountCall(_ctx: Context) {
  return proc.getSetAccountCall(_ctx)
}

export function getRegistrarAddedEvent(_ctx: Context) {
  return proc.getRegistrarAddedEvent(_ctx)
}

export function getRemoveExpiredApprovalCall(_ctx: Context) {
  return proc.getRemoveExpiredApprovalCall(_ctx)
}

export function getAddRegistrarCall(_ctx: Context) {
  return proc.getAddRegistrarCall(_ctx)
}
