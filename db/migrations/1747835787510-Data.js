module.exports = class Data1747835787510 {
    name = 'Data1747835787510'

    async up(db) {
        await db.query(`CREATE TABLE "registrar" ("id" character varying NOT NULL, "address" text NOT NULL, CONSTRAINT "PK_2d7bb9639e37cbd75296d2183b2" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "registrar"`)
    }
}
