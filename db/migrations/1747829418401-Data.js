module.exports = class Data1747829418401 {
  name = 'Data1747829418401'

  async up(db) {
    await db.query(
      `CREATE TABLE "sub" ("id" character varying NOT NULL, "name" text NOT NULL, "block_number" numeric, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "origin" character varying(6) NOT NULL, "identity_id" character varying, CONSTRAINT "PK_aaa48ae541d7446ee5fff28e732" PRIMARY KEY ("id"))`
    )
    await db.query(
      `CREATE INDEX "IDX_11d0d1c557b7c9ee76420c51b3" ON "sub" ("identity_id") `
    )
    await db.query(
      `CREATE INDEX "IDX_626c44d79c7175275dd9e14d38" ON "sub" ("block_number") `
    )
    await db.query(
      `CREATE INDEX "IDX_aaa5bfc0a17e0d4ef8ca43bc2c" ON "sub" ("updated_at") `
    )
    await db.query(
      `CREATE INDEX "IDX_b175986294a1fb49705c6a3351" ON "sub" ("created_at") `
    )
    await db.query(
      `ALTER TABLE "username" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL`
    )
    await db.query(
      `ALTER TABLE "identity" ADD "jugdement" character varying(10)`
    )
    await db.query(`ALTER TABLE "identity" ADD "registrar" integer`)
    await db.query(`ALTER TABLE "identity" ADD "hash" text`)
    await db.query(`ALTER TABLE "identity" ADD "block_number" numeric`)
    await db.query(
      `ALTER TABLE "identity" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL`
    )
    await db.query(
      `ALTER TABLE "identity" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL`
    )
    await db.query(
      `ALTER TABLE "identity" ADD "origin" character varying(6) NOT NULL`
    )
    await db.query(`ALTER TABLE "identity" ADD "burned" boolean NOT NULL`)
    await db.query(
      `CREATE INDEX "IDX_9d0a711a80bec3211750a4c65d" ON "username" ("created_at") `
    )
    await db.query(
      `CREATE INDEX "IDX_7172221af55fd7ab5e22de0b2c" ON "identity" ("block_number") `
    )
    await db.query(
      `CREATE INDEX "IDX_e2f786ba7b107a640bcc275722" ON "identity" ("updated_at") `
    )
    await db.query(
      `CREATE INDEX "IDX_eda2ef8b1da50af259877271db" ON "identity" ("created_at") `
    )
    await db.query(
      `ALTER TABLE "sub" ADD CONSTRAINT "FK_11d0d1c557b7c9ee76420c51b32" FOREIGN KEY ("identity_id") REFERENCES "identity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  async down(db) {
    await db.query(`DROP TABLE "sub"`)
    await db.query(`DROP INDEX "public"."IDX_11d0d1c557b7c9ee76420c51b3"`)
    await db.query(`DROP INDEX "public"."IDX_626c44d79c7175275dd9e14d38"`)
    await db.query(`DROP INDEX "public"."IDX_aaa5bfc0a17e0d4ef8ca43bc2c"`)
    await db.query(`DROP INDEX "public"."IDX_b175986294a1fb49705c6a3351"`)
    await db.query(`ALTER TABLE "username" DROP COLUMN "created_at"`)
    await db.query(`ALTER TABLE "identity" DROP COLUMN "jugdement"`)
    await db.query(`ALTER TABLE "identity" DROP COLUMN "registrar"`)
    await db.query(`ALTER TABLE "identity" DROP COLUMN "hash"`)
    await db.query(`ALTER TABLE "identity" DROP COLUMN "block_number"`)
    await db.query(`ALTER TABLE "identity" DROP COLUMN "updated_at"`)
    await db.query(`ALTER TABLE "identity" DROP COLUMN "created_at"`)
    await db.query(`ALTER TABLE "identity" DROP COLUMN "origin"`)
    await db.query(`ALTER TABLE "identity" DROP COLUMN "burned"`)
    await db.query(`DROP INDEX "public"."IDX_9d0a711a80bec3211750a4c65d"`)
    await db.query(`DROP INDEX "public"."IDX_7172221af55fd7ab5e22de0b2c"`)
    await db.query(`DROP INDEX "public"."IDX_e2f786ba7b107a640bcc275722"`)
    await db.query(`DROP INDEX "public"."IDX_eda2ef8b1da50af259877271db"`)
    await db.query(
      `ALTER TABLE "sub" DROP CONSTRAINT "FK_11d0d1c557b7c9ee76420c51b32"`
    )
  }
}
