import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, Index as Index_} from "@subsquid/typeorm-store"
import {Identity} from "./identity.model"

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
}
