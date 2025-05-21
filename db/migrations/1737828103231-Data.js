module.exports = class Data1737828103231 {
  name = 'Data1737828103231'

  async up(db) {
    await db.query(
      `CREATE TABLE "username" ("id" character varying NOT NULL, "primary" boolean NOT NULL, "name" text NOT NULL, "identity_id" character varying, CONSTRAINT "PK_fd8e31cc54a22af809d3fbf587b" PRIMARY KEY ("id"))`
    )
    await db.query(
      `CREATE INDEX "IDX_9950fb912ab7befbddf2bf1ada" ON "username" ("name") `
    )
    await db.query(
      `CREATE INDEX "IDX_4bdc9a114fca5f423c1c2e1688" ON "username" ("identity_id") `
    )
    await db.query(
      `CREATE TABLE "event" ("id" character varying NOT NULL, "block_number" numeric, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "caller" text NOT NULL, "current_owner" text NOT NULL, "interaction" character varying(7) NOT NULL, "meta" text NOT NULL, "identity_id" character varying, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`
    )
    await db.query(
      `CREATE INDEX "IDX_bc7c357dfc44b0f939648c00a6" ON "event" ("identity_id") `
    )
    await db.query(
      `CREATE TABLE "identity" ("id" character varying NOT NULL, "name" text, "legal" text, "web" text, "matrix" text, "email" text, "image" text, "twitter" text, "github" text, "discord" text, CONSTRAINT "PK_ff16a44186b286d5e626178f726" PRIMARY KEY ("id"))`
    )
    await db.query(
      `CREATE INDEX "IDX_883ba5be237fba47f2a2f39145" ON "identity" ("name") `
    )
    await db.query(
      `CREATE INDEX "IDX_fe3e4bdf7f93a8e8a881c7d6a7" ON "identity" ("twitter") `
    )
    await db.query(
      `CREATE TABLE "cache_status" ("id" character varying NOT NULL, "last_block_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_1001e39eb0aa38d043d96f7f4fa" PRIMARY KEY ("id"))`
    )
    await db.query(
      `ALTER TABLE "username" ADD CONSTRAINT "FK_4bdc9a114fca5f423c1c2e1688e" FOREIGN KEY ("identity_id") REFERENCES "identity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await db.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_bc7c357dfc44b0f939648c00a6b" FOREIGN KEY ("identity_id") REFERENCES "identity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  async down(db) {
    await db.query(`DROP TABLE "username"`)
    await db.query(`DROP INDEX "public"."IDX_9950fb912ab7befbddf2bf1ada"`)
    await db.query(`DROP INDEX "public"."IDX_4bdc9a114fca5f423c1c2e1688"`)
    await db.query(`DROP TABLE "event"`)
    await db.query(`DROP INDEX "public"."IDX_bc7c357dfc44b0f939648c00a6"`)
    await db.query(`DROP TABLE "identity"`)
    await db.query(`DROP INDEX "public"."IDX_883ba5be237fba47f2a2f39145"`)
    await db.query(`DROP INDEX "public"."IDX_fe3e4bdf7f93a8e8a881c7d6a7"`)
    await db.query(`DROP TABLE "cache_status"`)
    await db.query(
      `ALTER TABLE "username" DROP CONSTRAINT "FK_4bdc9a114fca5f423c1c2e1688e"`
    )
    await db.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_bc7c357dfc44b0f939648c00a6b"`
    )
  }
}
