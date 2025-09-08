module.exports = class Data1757346042260 {
    name = 'Data1757346042260'

    async up(db) {
        await db.query(`ALTER TABLE "sub" ADD "deposit" numeric`)
        await db.query(`ALTER TABLE "identity" ADD "deposit" numeric`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "sub" DROP COLUMN "deposit"`)
        await db.query(`ALTER TABLE "identity" DROP COLUMN "deposit"`)
    }
}
