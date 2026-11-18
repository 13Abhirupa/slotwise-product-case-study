import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateServiceTable1794992107093 implements MigrationInterface {
    name = 'CreateServiceTable1794992107093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "service" ("service_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "business_id" uuid NOT NULL, "service_name" character varying(150) NOT NULL, "description" text, "duration_minutes" integer NOT NULL, "price" numeric(10,2) NOT NULL, "service_status" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_48c5a0e13da2b2948fb7f3a0c4a" PRIMARY KEY ("service_id"))`);
        await queryRunner.query(`ALTER TABLE "service" ADD CONSTRAINT "FK_89f78c853cdc9cc2231d0d6e031" FOREIGN KEY ("business_id") REFERENCES "business"("business_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service" DROP CONSTRAINT "FK_89f78c853cdc9cc2231d0d6e031"`);
        await queryRunner.query(`DROP TABLE "service"`);
    }

}
