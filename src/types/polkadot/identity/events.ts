import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v5 from '../v5'
import * as v15 from '../v15'
import * as v9140 from '../v9140'
import * as v1002000 from '../v1002000'

export const identitySet =  {
    name: 'Identity.IdentitySet',
    /**
     *  A name was set or reset (which will remove all judgements).
     */
    v5: new EventType(
        'Identity.IdentitySet',
        v5.AccountId
    ),
    /**
     * A name was set or reset (which will remove all judgements).
     */
    v9140: new EventType(
        'Identity.IdentitySet',
        sts.struct({
            who: v9140.AccountId32,
        })
    ),
}

export const identityCleared =  {
    name: 'Identity.IdentityCleared',
    /**
     *  A name was cleared, and the given balance returned.
     */
    v5: new EventType(
        'Identity.IdentityCleared',
        sts.tuple([v5.AccountId, v5.Balance])
    ),
    /**
     * A name was cleared, and the given balance returned.
     */
    v9140: new EventType(
        'Identity.IdentityCleared',
        sts.struct({
            who: v9140.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}

export const identityKilled =  {
    name: 'Identity.IdentityKilled',
    /**
     *  A name was removed and the given balance slashed.
     */
    v5: new EventType(
        'Identity.IdentityKilled',
        sts.tuple([v5.AccountId, v5.Balance])
    ),
    /**
     * A name was removed and the given balance slashed.
     */
    v9140: new EventType(
        'Identity.IdentityKilled',
        sts.struct({
            who: v9140.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}

export const judgementRequested =  {
    name: 'Identity.JudgementRequested',
    /**
     *  A judgement was asked from a registrar.
     */
    v5: new EventType(
        'Identity.JudgementRequested',
        sts.tuple([v5.AccountId, v5.RegistrarIndex])
    ),
    /**
     * A judgement was asked from a registrar.
     */
    v9140: new EventType(
        'Identity.JudgementRequested',
        sts.struct({
            who: v9140.AccountId32,
            registrarIndex: sts.number(),
        })
    ),
}

export const judgementUnrequested =  {
    name: 'Identity.JudgementUnrequested',
    /**
     *  A judgement request was retracted.
     */
    v5: new EventType(
        'Identity.JudgementUnrequested',
        sts.tuple([v5.AccountId, v5.RegistrarIndex])
    ),
    /**
     * A judgement request was retracted.
     */
    v9140: new EventType(
        'Identity.JudgementUnrequested',
        sts.struct({
            who: v9140.AccountId32,
            registrarIndex: sts.number(),
        })
    ),
}

export const judgementGiven =  {
    name: 'Identity.JudgementGiven',
    /**
     *  A judgement was given by a registrar.
     */
    v5: new EventType(
        'Identity.JudgementGiven',
        sts.tuple([v5.AccountId, v5.RegistrarIndex])
    ),
    /**
     * A judgement was given by a registrar.
     */
    v9140: new EventType(
        'Identity.JudgementGiven',
        sts.struct({
            target: v9140.AccountId32,
            registrarIndex: sts.number(),
        })
    ),
}

export const registrarAdded =  {
    name: 'Identity.RegistrarAdded',
    /**
     *  A registrar was added.
     */
    v5: new EventType(
        'Identity.RegistrarAdded',
        v5.RegistrarIndex
    ),
    /**
     * A registrar was added.
     */
    v9140: new EventType(
        'Identity.RegistrarAdded',
        sts.struct({
            registrarIndex: sts.number(),
        })
    ),
}

export const subIdentityAdded =  {
    name: 'Identity.SubIdentityAdded',
    /**
     *  A sub-identity (first) was added to an identity (second) and the deposit paid.
     */
    v15: new EventType(
        'Identity.SubIdentityAdded',
        sts.tuple([v15.AccountId, v15.AccountId, v15.Balance])
    ),
    /**
     * A sub-identity was added to an identity and the deposit paid.
     */
    v9140: new EventType(
        'Identity.SubIdentityAdded',
        sts.struct({
            sub: v9140.AccountId32,
            main: v9140.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}

export const subIdentityRemoved =  {
    name: 'Identity.SubIdentityRemoved',
    /**
     *  A sub-identity (first) was removed from an identity (second) and the deposit freed.
     */
    v15: new EventType(
        'Identity.SubIdentityRemoved',
        sts.tuple([v15.AccountId, v15.AccountId, v15.Balance])
    ),
    /**
     * A sub-identity was removed from an identity and the deposit freed.
     */
    v9140: new EventType(
        'Identity.SubIdentityRemoved',
        sts.struct({
            sub: v9140.AccountId32,
            main: v9140.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}

export const subIdentityRevoked =  {
    name: 'Identity.SubIdentityRevoked',
    /**
     *  A sub-identity (first arg) was cleared, and the given deposit repatriated from the
     *  main identity account (second arg) to the sub-identity account.
     */
    v15: new EventType(
        'Identity.SubIdentityRevoked',
        sts.tuple([v15.AccountId, v15.AccountId, v15.Balance])
    ),
    /**
     * A sub-identity was cleared, and the given deposit repatriated from the
     * main identity account to the sub-identity account.
     */
    v9140: new EventType(
        'Identity.SubIdentityRevoked',
        sts.struct({
            sub: v9140.AccountId32,
            main: v9140.AccountId32,
            deposit: sts.bigint(),
        })
    ),
}

export const authorityAdded =  {
    name: 'Identity.AuthorityAdded',
    /**
     * A username authority was added.
     */
    v1002000: new EventType(
        'Identity.AuthorityAdded',
        sts.struct({
            authority: v1002000.AccountId32,
        })
    ),
}

export const authorityRemoved =  {
    name: 'Identity.AuthorityRemoved',
    /**
     * A username authority was removed.
     */
    v1002000: new EventType(
        'Identity.AuthorityRemoved',
        sts.struct({
            authority: v1002000.AccountId32,
        })
    ),
}

export const usernameSet =  {
    name: 'Identity.UsernameSet',
    /**
     * A username was set for `who`.
     */
    v1002000: new EventType(
        'Identity.UsernameSet',
        sts.struct({
            who: v1002000.AccountId32,
            username: v1002000.BoundedVec,
        })
    ),
}

export const usernameQueued =  {
    name: 'Identity.UsernameQueued',
    /**
     * A username was queued, but `who` must accept it prior to `expiration`.
     */
    v1002000: new EventType(
        'Identity.UsernameQueued',
        sts.struct({
            who: v1002000.AccountId32,
            username: v1002000.BoundedVec,
            expiration: sts.number(),
        })
    ),
}

export const preapprovalExpired =  {
    name: 'Identity.PreapprovalExpired',
    /**
     * A queued username passed its expiration without being claimed and was removed.
     */
    v1002000: new EventType(
        'Identity.PreapprovalExpired',
        sts.struct({
            whose: v1002000.AccountId32,
        })
    ),
}

export const primaryUsernameSet =  {
    name: 'Identity.PrimaryUsernameSet',
    /**
     * A username was set as a primary and can be looked up from `who`.
     */
    v1002000: new EventType(
        'Identity.PrimaryUsernameSet',
        sts.struct({
            who: v1002000.AccountId32,
            username: v1002000.BoundedVec,
        })
    ),
}

export const danglingUsernameRemoved =  {
    name: 'Identity.DanglingUsernameRemoved',
    /**
     * A dangling username (as in, a username corresponding to an account that has removed its
     * identity) has been removed.
     */
    v1002000: new EventType(
        'Identity.DanglingUsernameRemoved',
        sts.struct({
            who: v1002000.AccountId32,
            username: v1002000.BoundedVec,
        })
    ),
}
