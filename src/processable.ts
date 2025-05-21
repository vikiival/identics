// LIST OF THE EVENTS / CALLS that we are processing
// USAGE: [NameOfThePallet].[EventName] or [NameOfThePallet].[call_name]
// Naming pattern is enforced by SubSquid

/**
 * Identity Pallet Events
 * @enum {string}
 * @readonly
 */
export enum IdentityEvent {
  setIdentity = 'Identity.IdentitySet',
  clearIdentity = 'Identity.IdentityCleared',
  killIdentity = 'Identity.IdentityKilled',
  requestJudgement = 'Identity.JudgementRequested',
  unrequestJudgement = 'Identity.JudgementUnrequested',
  giveJudgement = 'Identity.JudgementGiven',
  addRegistrar = 'Identity.RegistrarAdded',
  addSubIdentity = 'Identity.SubIdentityAdded',
  setSubIdentities = 'Identity.SubIdentitiesSet',
  renameSubIdentity = 'Identity.SubIdentityRenamed',
  removeSubIdentity = 'Identity.SubIdentityRemoved',
  revokeSubIdentity = 'Identity.SubIdentityRevoked',
  addAuthority = 'Identity.AuthorityAdded',
  removeAuthority = 'Identity.AuthorityRemoved',
  setUsername = 'Identity.UsernameSet',
  queueUsername = 'Identity.UsernameQueued',
  expirePreapproval = 'Identity.PreapprovalExpired',
  setPrimaryUsername = 'Identity.PrimaryUsernameSet',
  removeDanglingUsername = 'Identity.DanglingUsernameRemoved',
  unbindUsername = 'Identity.UsernameUnbound',
  removeUsername = 'Identity.UsernameRemoved',
  killUsername = 'Identity.UsernameKilled',
}

/**
 * Identity Pallet Calls
 * @enum {string}
 * @readonly
 */
export enum IdentityCall {
  setIdentity = 'Identity.set_identity',
  provideJudgement = 'Identity.provide_judgement',
  setSubs = 'Identity.set_subs',
  addSub = 'Identity.add_sub',
  renameSub = 'Identity.rename_sub',
  addUsernameAuthority = 'Identity.add_username_authority',
  removeUsernameAuthority = 'Identity.remove_username_authority',
  addRegistrar = 'Identity.add_registrar',
  setFee = 'Identity.set_fee',
  setFields = 'Identity.set_fields',
  setAccountId = 'Identity.set_account_id',
  requestJudgement = 'Identity.request_judgement',
  cancelRequest = 'Identity.cancel_request',
  removeSub = 'Identity.remove_sub',
  quitSub = 'Identity.quit_sub',
  setUsernameFor = 'Identity.set_username_for',
  acceptUsername = 'Identity.accept_username',
  setPrimaryUsername = 'Identity.set_primary_username',
  removeExpiredApproval = 'Identity.remove_expired_approval',
  removeDanglingUsername = 'Identity.remove_dangling_username',
}
