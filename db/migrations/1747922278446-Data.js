module.exports = class Data1747922278446 {
    name = 'Data1747922278446'

    async up(db) {
        await db.query(`ALTER TABLE "sub" ADD "type" character varying(9)`)
        await db.query(`ALTER TABLE "identity" ADD "type" character varying(9)`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "sub" DROP COLUMN "type"`)
        await db.query(`ALTER TABLE "identity" DROP COLUMN "type"`)
    }
}
