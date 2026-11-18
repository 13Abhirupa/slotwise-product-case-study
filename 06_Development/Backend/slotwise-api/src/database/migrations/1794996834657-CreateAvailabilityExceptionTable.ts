import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAvailabilityExceptionTable1794996834657 implements MigrationInterface {
    name = 'CreateAvailabilityExceptionTable1794996834657'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "availability_exception" ("exception_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "staff_id" uuid NOT NULL, "exception_date" date NOT NULL, "start_time" TIME, "end_time" TIME, "exception_type" character varying(30) NOT NULL, "reason" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1c70c9f5a87253c582fd47c28ff" PRIMARY KEY ("exception_id"))`);
        await queryRunner.query(`ALTER TABLE "availability_exception" ADD CONSTRAINT "FK_c9d94c8f44c5ebb74ed31f850fe" FOREIGN KEY ("staff_id") REFERENCES "staff"("staff_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "availability_exception" DROP CONSTRAINT "FK_c9d94c8f44c5ebb74ed31f850fe"`);
        await queryRunner.query(`DROP TABLE "availability_exception"`);
    }

}
