module.exports = class Data1747837954364 {
    name = 'Data1747837954364'

    async up(db) {
        await db.query(`CREATE TABLE "registrar" ("id" character varying NOT NULL, "address" text NOT NULL, "block_number" numeric, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "origin" character varying(6) NOT NULL, "fee" numeric, CONSTRAINT "PK_2d7bb9639e37cbd75296d2183b2" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_025bc49f856b3d23adbe488360" ON "registrar" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_bc924251ce5b6e9d31e208de93" ON "registrar" ("updated_at") `)
        await db.query(`CREATE INDEX "IDX_b7db7dee6b07b246ca64287c92" ON "registrar" ("created_at") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "registrar"`)
        await db.query(`DROP INDEX "public"."IDX_025bc49f856b3d23adbe488360"`)
        await db.query(`DROP INDEX "public"."IDX_bc924251ce5b6e9d31e208de93"`)
        await db.query(`DROP INDEX "public"."IDX_b7db7dee6b07b246ca64287c92"`)
    }
}
