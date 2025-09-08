module.exports = class Data1757364744098 {
  name = 'Data1757364744098'

  async up(db) {
    await db.query(
      `ALTER TABLE "username" ADD "address" text NOT NULL DEFAULT ''`
    )
    await db.query(`ALTER TABLE "username" ADD "block_number" numeric`)
    await db.query(
      `CREATE INDEX "IDX_22577bcec41a21c55b4eac95b2" ON "username" ("address") `
    )
    await db.query(
      `CREATE INDEX "IDX_c9bcbf41c0a3ac182abad52e11" ON "username" ("block_number") `
    )
  }

  async down(db) {
    await db.query(`ALTER TABLE "username" DROP COLUMN "address"`)
    await db.query(`ALTER TABLE "username" DROP COLUMN "block_number"`)
    await db.query(`DROP INDEX "public"."IDX_22577bcec41a21c55b4eac95b2"`)
    await db.query(`DROP INDEX "public"."IDX_c9bcbf41c0a3ac182abad52e11"`)
  }
}
