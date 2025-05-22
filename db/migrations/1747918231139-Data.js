module.exports = class Data1747918231139 {
    name = 'Data1747918231139'

    async up(db) {
        await db.query(`CREATE TABLE "authority" ("id" character varying NOT NULL, "address" text NOT NULL, "suffix" text NOT NULL, "block_number" numeric, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "origin" character varying(6) NOT NULL, CONSTRAINT "PK_b0f9bb35ff132fc6bd92d0582ce" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_e45f904214415a9f8d6873ab97" ON "authority" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_f9010a2cdec71c2fe0ce38e116" ON "authority" ("updated_at") `)
        await db.query(`CREATE INDEX "IDX_80bbbd1d283af7f0dabe5eba03" ON "authority" ("created_at") `)
        await db.query(`ALTER TABLE "username" ADD "grace_period" numeric`)
        await db.query(`ALTER TABLE "username" ADD "status" character varying(9) NOT NULL`)
        await db.query(`ALTER TABLE "registrar" ADD "field" numeric`)
        await db.query(`CREATE INDEX "IDX_27dee1e25debae59ab2f610314" ON "username" ("grace_period") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "authority"`)
        await db.query(`DROP INDEX "public"."IDX_e45f904214415a9f8d6873ab97"`)
        await db.query(`DROP INDEX "public"."IDX_f9010a2cdec71c2fe0ce38e116"`)
        await db.query(`DROP INDEX "public"."IDX_80bbbd1d283af7f0dabe5eba03"`)
        await db.query(`ALTER TABLE "username" DROP COLUMN "grace_period"`)
        await db.query(`ALTER TABLE "username" DROP COLUMN "status"`)
        await db.query(`ALTER TABLE "registrar" DROP COLUMN "field"`)
        await db.query(`DROP INDEX "public"."IDX_27dee1e25debae59ab2f610314"`)
    }
}
