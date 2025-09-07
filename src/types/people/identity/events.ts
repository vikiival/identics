import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v1002006 from '../v1002006'
import * as v1005001 from '../v1005001'

export const identitySet =  {
    name: 'Identity.IdentitySet',
    /**
     * A name was set or reset (which will remove all judgements).
     */
    v1002006: new EventType(
        'Identity.IdentitySet',
        sts.struct({
            who: v1002006.AccountId32,
        })
    ),
}

export const identityCleared =  {
    name: 'Identity.IdentityCleared',
    /**
     * A name was cleared, and the given balance returned.
     */
    v1002006: new EventType(
        'Identity.IdentityCleared',
        sts.struct({
            who: v1002006.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}

export const identityKilled =  {
    name: 'Identity.IdentityKilled',
    /**
     * A name was removed and the given balance slashed.
     */
    v1002006: new EventType(
        'Identity.IdentityKilled',
        sts.struct({
            who: v1002006.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}

export const judgementRequested =  {
    name: 'Identity.JudgementRequested',
    /**
     * A judgement was asked from a registrar.
     */
    v1002006: new EventType(
        'Identity.JudgementRequested',
        sts.struct({
            who: v1002006.AccountId32,
            registrarIndex: sts.number(),
        })
    ),
}

export const judgementUnrequested =  {
    name: 'Identity.JudgementUnrequested',
    /**
     * A judgement request was retracted.
     */
    v1002006: new EventType(
        'Identity.JudgementUnrequested',
        sts.struct({
            who: v1002006.AccountId32,
            registrarIndex: sts.number(),
        })
    ),
}

export const judgementGiven =  {
    name: 'Identity.JudgementGiven',
    /**
     * A judgement was given by a registrar.
     */
    v1002006: new EventType(
        'Identity.JudgementGiven',
        sts.struct({
            target: v1002006.AccountId32,
            registrarIndex: sts.number(),
        })
    ),
}

export const registrarAdded =  {
    name: 'Identity.RegistrarAdded',
    /**
     * A registrar was added.
     */
    v1002006: new EventType(
        'Identity.RegistrarAdded',
        sts.struct({
            registrarIndex: sts.number(),
        })
    ),
}

export const subIdentityAdded =  {
    name: 'Identity.SubIdentityAdded',
    /**
     * A sub-identity was added to an identity and the deposit paid.
     */
    v1002006: new EventType(
        'Identity.SubIdentityAdded',
        sts.struct({
            sub: v1002006.AccountId32,
            main: v1002006.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}

export const subIdentityRemoved =  {
    name: 'Identity.SubIdentityRemoved',
    /**
     * A sub-identity was removed from an identity and the deposit freed.
     */
    v1002006: new EventType(
        'Identity.SubIdentityRemoved',
        sts.struct({
            sub: v1002006.AccountId32,
            main: v1002006.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}

export const subIdentityRevoked =  {
    name: 'Identity.SubIdentityRevoked',
    /**
     * A sub-identity was cleared, and the given deposit repatriated from the
     * main identity account to the sub-identity account.
     */
    v1002006: new EventType(
        'Identity.SubIdentityRevoked',
        sts.struct({
            sub: v1002006.AccountId32,
            main: v1002006.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}

export const authorityAdded =  {
    name: 'Identity.AuthorityAdded',
    /**
     * A username authority was added.
     */
    v1002006: new EventType(
        'Identity.AuthorityAdded',
        sts.struct({
            authority: v1002006.AccountId32,
        })
    ),
}

export const authorityRemoved =  {
    name: 'Identity.AuthorityRemoved',
    /**
     * A username authority was removed.
     */
    v1002006: new EventType(
        'Identity.AuthorityRemoved',
        sts.struct({
            authority: v1002006.AccountId32,
        })
    ),
}

export const usernameSet =  {
    name: 'Identity.UsernameSet',
    /**
     * A username was set for `who`.
     */
    v1002006: new EventType(
        'Identity.UsernameSet',
        sts.struct({
            who: v1002006.AccountId32,
            username: sts.bytes(),
        })
    ),
}

export const usernameQueued =  {
    name: 'Identity.UsernameQueued',
    /**
     * A username was queued, but `who` must accept it prior to `expiration`.
     */
    v1002006: new EventType(
        'Identity.UsernameQueued',
        sts.struct({
            who: v1002006.AccountId32,
            username: sts.bytes(),
            expiration: sts.number(),
        })
    ),
}

export const preapprovalExpired =  {
    name: 'Identity.PreapprovalExpired',
    /**
     * A queued username passed its expiration without being claimed and was removed.
     */
    v1002006: new EventType(
        'Identity.PreapprovalExpired',
        sts.struct({
            whose: v1002006.AccountId32,
        })
    ),
}

export const primaryUsernameSet =  {
    name: 'Identity.PrimaryUsernameSet',
    /**
     * A username was set as a primary and can be looked up from `who`.
     */
    v1002006: new EventType(
        'Identity.PrimaryUsernameSet',
        sts.struct({
            who: v1002006.AccountId32,
            username: sts.bytes(),
        })
    ),
}

export const danglingUsernameRemoved =  {
    name: 'Identity.DanglingUsernameRemoved',
    /**
     * A dangling username (as in, a username corresponding to an account that has removed its
     * identity) has been removed.
     */
    v1002006: new EventType(
        'Identity.DanglingUsernameRemoved',
        sts.struct({
            who: v1002006.AccountId32,
            username: sts.bytes(),
        })
    ),
}

export const subIdentitiesSet =  {
    name: 'Identity.SubIdentitiesSet',
    /**
     * An account's sub-identities were set (in bulk).
     */
    v1005001: new EventType(
        'Identity.SubIdentitiesSet',
        sts.struct({
            main: v1005001.AccountId32,
            numberOfSubs: sts.number(),
            newDeposit: sts.bigint(),
        })
    ),
}

export const subIdentityRenamed =  {
    name: 'Identity.SubIdentityRenamed',
    /**
     * A given sub-account's associated name was changed by its super-identity.
     */
    v1005001: new EventType(
        'Identity.SubIdentityRenamed',
        sts.struct({
            sub: v1005001.AccountId32,
            main: v1005001.AccountId32,
        })
    ),
}

export const usernameUnbound =  {
    name: 'Identity.UsernameUnbound',
    /**
     * A username has been unbound.
     */
    v1005001: new EventType(
        'Identity.UsernameUnbound',
        sts.struct({
            username: sts.bytes(),
        })
    ),
}

export const usernameRemoved =  {
    name: 'Identity.UsernameRemoved',
    /**
     * A username has been removed.
     */
    v1005001: new EventType(
        'Identity.UsernameRemoved',
        sts.struct({
            username: sts.bytes(),
        })
    ),
}

export const usernameKilled =  {
    name: 'Identity.UsernameKilled',
    /**
     * A username has been killed.
     */
    v1005001: new EventType(
        'Identity.UsernameKilled',
        sts.struct({
            username: sts.bytes(),
        })
    ),
}
