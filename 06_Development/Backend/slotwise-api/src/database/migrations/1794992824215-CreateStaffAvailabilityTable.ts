import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStaffAvailabilityTable1794992824215 implements MigrationInterface {
    name = 'CreateStaffAvailabilityTable1794992824215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "staff_availability" ("availability_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "staff_id" uuid NOT NULL, "day_of_week" smallint NOT NULL, "start_time" TIME NOT NULL, "end_time" TIME NOT NULL, "is_available" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ee2a2f4d5ddde7a1af2365fa698" PRIMARY KEY ("availability_id"))`);
        await queryRunner.query(`ALTER TABLE "staff_availability" ADD CONSTRAINT "FK_a948cce1d3b96525d4ac4dfb786" FOREIGN KEY ("staff_id") REFERENCES "staff"("staff_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff_availability" DROP CONSTRAINT "FK_a948cce1d3b96525d4ac4dfb786"`);
        await queryRunner.query(`DROP TABLE "staff_availability"`);
    }

}
