import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCustomerTable1794912421578 implements MigrationInterface {
    name = 'CreateCustomerTable1794912421578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customer" ("customer_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "business_id" uuid NOT NULL, "full_name" character varying(150) NOT NULL, "phone" character varying(20), "email" character varying(150), "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cde3d123fc6077bcd75eb051226" PRIMARY KEY ("customer_id"))`);
        await queryRunner.query(`ALTER TABLE "customer" ADD CONSTRAINT "FK_9ca98deab5f4c69b8e7f7665444" FOREIGN KEY ("business_id") REFERENCES "business"("business_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP CONSTRAINT "FK_9ca98deab5f4c69b8e7f7665444"`);
        await queryRunner.query(`DROP TABLE "customer"`);
    }

}
