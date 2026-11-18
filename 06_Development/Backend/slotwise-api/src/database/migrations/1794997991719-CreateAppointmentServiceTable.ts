import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppointmentServiceTable1794997991719 implements MigrationInterface {
    name = 'CreateAppointmentServiceTable1794997991719'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "appointment_service" ("appointment_service_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appointment_id" uuid NOT NULL, "service_id" uuid NOT NULL, "service_price" numeric(10,2) NOT NULL, "service_duration_minutes" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f470dff333dec83d0afe19c0e06" PRIMARY KEY ("appointment_service_id"))`);
        await queryRunner.query(`ALTER TABLE "appointment_service" ADD CONSTRAINT "FK_58b8e2ad0205bb5b1222fe92a02" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("appointment_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointment_service" ADD CONSTRAINT "FK_5afa325f92c7cf97afe840a879d" FOREIGN KEY ("service_id") REFERENCES "service"("service_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "appointment_service" DROP CONSTRAINT "FK_5afa325f92c7cf97afe840a879d"`);
        await queryRunner.query(`ALTER TABLE "appointment_service" DROP CONSTRAINT "FK_58b8e2ad0205bb5b1222fe92a02"`);
        await queryRunner.query(`DROP TABLE "appointment_service"`);
    }

}
