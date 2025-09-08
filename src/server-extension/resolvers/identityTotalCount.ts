/* eslint-disable camelcase */
import { Arg, Query, Resolver } from 'type-graphql'
import { EntityManager } from 'typeorm'
import { makeQuery } from '../utils'
import { identityCountQuery } from '../query/identityCountQuery'
import { CountEntity, CountEntityQueryResult } from '../model/count.model'

@Resolver()
export class IdentityCountResolver {
  constructor(private tx: () => Promise<EntityManager>) {}

  @Query(() => CountEntity)
  async identityEntityCount(): Promise<CountEntity> {
    const rawData: CountEntityQueryResult[] = await makeQuery(
      this.tx,
      CountEntity,
      identityCountQuery
    )
    return new CountEntity(rawData[0].total_count)
  }
}
