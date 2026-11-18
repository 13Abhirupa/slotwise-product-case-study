import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePaymentTable1794998110333 implements MigrationInterface {
    name = 'CreatePaymentTable1794998110333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment" ("payment_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appointment_id" uuid NOT NULL, "amount" numeric(10,2) NOT NULL, "payment_method" character varying(30) NOT NULL, "payment_status" character varying(30) NOT NULL, "transaction_reference" character varying(150), "payment_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9fff60ac6ac1844ea4e0cfba67a" PRIMARY KEY ("payment_id"))`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_6283a6acdef307ea75c4deb3fd9" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("appointment_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_6283a6acdef307ea75c4deb3fd9"`);
        await queryRunner.query(`DROP TABLE "payment"`);
    }

}
