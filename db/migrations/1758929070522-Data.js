module.exports = class Data1758929070522 {
  name = 'Data1758929070522'

  async up(db) {
    await db.query(`ALTER TABLE "authority" ADD "allocation" integer`)
    await db.query(
      `CREATE INDEX "IDX_636be0be8afde80b468419446b" ON "authority" ("allocation") `
    )
  }

  async down(db) {
    await db.query(`ALTER TABLE "authority" DROP COLUMN "allocation"`)
    await db.query(`DROP INDEX "public"."IDX_636be0be8afde80b468419446b"`)
  }
}
