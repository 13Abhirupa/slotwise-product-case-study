import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppointmentTable1794997862223 implements MigrationInterface {
    name = 'CreateAppointmentTable1794997862223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appointment" ("appointment_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "business_id" uuid NOT NULL, "customer_id" uuid, "staff_id" uuid NOT NULL, "appointment_date" date NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "appointment_status" character varying(30) NOT NULL, "booking_source" character varying(30) NOT NULL, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ee9f73735a635356d4da9bd3e69" PRIMARY KEY ("appointment_id"))`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_d5ac206bfc101cbf8c120626857" FOREIGN KEY ("business_id") REFERENCES "business"("business_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_6093cfbc767de74a62b7368b279" FOREIGN KEY ("customer_id") REFERENCES "customer"("customer_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment" ADD CONSTRAINT "FK_43177b2ccf4d809a8582ca6a6b1" FOREIGN KEY ("staff_id") REFERENCES "staff"("staff_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_43177b2ccf4d809a8582ca6a6b1"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_6093cfbc767de74a62b7368b279"`);
        await queryRunner.query(`ALTER TABLE "appointment" DROP CONSTRAINT "FK_d5ac206bfc101cbf8c120626857"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
    }

}
