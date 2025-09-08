import 'reflect-metadata'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class UsernameEntity {
  @Field(() => String, { nullable: false })
  id!: string

  @Field(() => Boolean, { nullable: false })
  primary!: boolean

  @Field(() => String, { nullable: false })
  name!: string

  @Field(() => String, { nullable: false })
  address!: string

  @Field(() => Date, { nullable: false })
  createdAt!: Date

  @Field(() => BigInt, { nullable: true })
  gracePeriod!: bigint | undefined | null

  @Field(() => String, { nullable: false })
  status!: string

  constructor(props: Partial<UsernameEntity>) {
    Object.assign(this, props)
  }
}
