/* eslint-disable camelcase */
import { Arg, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { Username } from '../../model'
import { usernameByIdentityQuery } from '../query/usernameQuery'
import { makeQuery } from '../utils'
import { UsernameEntity } from '../model/username.model'

@Resolver()
export class UsernameIdentityResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => [UsernameEntity])
  async usernameListByIdentity(
    @Arg('account', { nullable: false }) account: string,
    // @Arg('limit', { nullable: true, defaultValue: 20 }) limit: number,
    // @Arg('offset', { nullable: true, defaultValue: 0 }) offset: number,
    @Arg('onlyPrimary', { nullable: true }) onlyPrimary?: boolean
  ): Promise<UsernameEntity[]> {
    const result: UsernameEntity[] = await makeQuery(
      this.tx,
      Username,
      usernameByIdentityQuery,
      [account, onlyPrimary]
    )
    return result
  }
}
