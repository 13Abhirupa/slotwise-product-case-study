import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBusinessTable1794909850351 implements MigrationInterface {
    name = 'CreateBusinessTable1794909850351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "business" ("business_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "business_name" character varying(150) NOT NULL, "business_type" character varying(50), "email" character varying(150), "phone" character varying(20), "address" text, "timezone" character varying(50), "status" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a8b2281570e69c768f3c363184b" PRIMARY KEY ("business_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "business"`);
    }

}
