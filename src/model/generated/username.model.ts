import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, BooleanColumn as BooleanColumn_, StringColumn as StringColumn_, Index as Index_, ManyToOne as ManyToOne_} from "@subsquid/typeorm-store"
import {Identity} from "./identity.model"

@Entity_()
export class Username {
    constructor(props?: Partial<Username>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @BooleanColumn_({nullable: false})
    primary!: boolean

    @Index_()
    @StringColumn_({nullable: false})
    name!: string

    @Index_()
    @ManyToOne_(() => Identity, {nullable: true})
    identity!: Identity
}
