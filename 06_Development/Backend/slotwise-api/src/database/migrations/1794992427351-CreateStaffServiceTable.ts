import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStaffServiceTable1794992427351 implements MigrationInterface {
    name = 'CreateStaffServiceTable1794992427351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "staff_service" ("staff_service_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "staff_id" uuid NOT NULL, "service_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_staff_service_staff_service" UNIQUE ("staff_id", "service_id"), CONSTRAINT "PK_38b7aaaed9c0d46d43923f4f457" PRIMARY KEY ("staff_service_id"))`);
        await queryRunner.query(`ALTER TABLE "staff_service" ADD CONSTRAINT "FK_471186ac31b7c5828be72a99aff" FOREIGN KEY ("staff_id") REFERENCES "staff"("staff_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff_service" ADD CONSTRAINT "FK_31d55b961753e2cc32b7704908a" FOREIGN KEY ("service_id") REFERENCES "service"("service_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_service" DROP CONSTRAINT "FK_31d55b961753e2cc32b7704908a"`);
        await queryRunner.query(`ALTER TABLE "staff_service" DROP CONSTRAINT "FK_471186ac31b7c5828be72a99aff"`);
        await queryRunner.query(`DROP TABLE "staff_service"`);
    }

}
