import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {Identity} from "./identity.model"
import {ChainOrigin} from "./_chainOrigin"
import {AddressType} from "./_addressType"

@Entity_()
export class Sub {
    constructor(props?: Partial<Sub>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    name!: string

    @Index_()
    @ManyToOne_(() => Identity, {nullable: true})
    identity!: Identity

    @Index_()
    @BigIntColumn_({nullable: true})
    blockNumber!: bigint | undefined | null

    @Index_()
    @DateTimeColumn_({nullable: false})
    updatedAt!: Date

    @Index_()
    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @Column_("varchar", {length: 6, nullable: false})
    origin!: ChainOrigin

    @Column_("varchar", {length: 9, nullable: true})
    type!: AddressType | undefined | null

    @BigIntColumn_({nullable: true})
    deposit!: bigint | undefined | null
}
