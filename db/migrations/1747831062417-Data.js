module.exports = class Data1747831062417 {
    name = 'Data1747831062417'

    async up(db) {
        await db.query(`ALTER TABLE "identity" RENAME COLUMN "jugdement" TO "judgement"`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "identity" RENAME COLUMN "judgement" TO "jugdement"`)
    }
}
