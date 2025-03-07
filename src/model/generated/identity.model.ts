import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_, OneToMany as OneToMany_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {Username} from "./username.model"
import {Event} from "./event.model"
import {Sub} from "./sub.model"
import {Judgement} from "./_judgement"

@Entity_()
export class Identity {
    constructor(props?: Partial<Identity>) {
        Object.assign(this, props)
    }

    /**
     * Account address
     */
    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: true})
    name!: string | undefined | null

    @StringColumn_({nullable: true})
    legal!: string | undefined | null

    @StringColumn_({nullable: true})
    web!: string | undefined | null

    @StringColumn_({nullable: true})
    matrix!: string | undefined | null

    @StringColumn_({nullable: true})
    email!: string | undefined | null

    @StringColumn_({nullable: true})
    image!: string | undefined | null

    @Index_()
    @StringColumn_({nullable: true})
    twitter!: string | undefined | null

    @StringColumn_({nullable: true})
    github!: string | undefined | null

    @StringColumn_({nullable: true})
    discord!: string | undefined | null

    @OneToMany_(() => Username, e => e.identity)
    usernames!: Username[]

    @OneToMany_(() => Event, e => e.identity)
    events!: Event[]

    @OneToMany_(() => Sub, e => e.identity)
    subs!: Sub[]

    /**
     * Jugdement
     */
    @Column_("varchar", {length: 10, nullable: true})
    jugdement!: Judgement | undefined | null

    @IntColumn_({nullable: true})
    registrar!: number | undefined | null

    @StringColumn_({nullable: true})
    hash!: string | undefined | null
}
