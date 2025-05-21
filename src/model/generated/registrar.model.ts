import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {ChainOrigin} from "./_chainOrigin"

@Entity_()
export class Registrar {
    constructor(props?: Partial<Registrar>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    address!: string

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

    @BigIntColumn_({nullable: true})
    fee!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    field!: bigint | undefined | null
}
