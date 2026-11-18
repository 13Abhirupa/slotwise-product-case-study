import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStaffTable1794912250611 implements MigrationInterface {
    name = 'CreateStaffTable1794912250611'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "staff" ("staff_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "business_id" uuid NOT NULL, "membership_id" uuid, "full_name" character varying(150) NOT NULL, "phone" character varying(20), "email" character varying(150), "employment_status" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ce6869e5d8a52ed3edd5cb750f6" PRIMARY KEY ("staff_id"))`);
        await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "FK_c78e4999feaf19a95765ef79d94" FOREIGN KEY ("business_id") REFERENCES "business"("business_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff" ADD CONSTRAINT "FK_2e8be2ced5badd7744ed536e748" FOREIGN KEY ("membership_id") REFERENCES "business_membership"("membership_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_2e8be2ced5badd7744ed536e748"`);
        await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_c78e4999feaf19a95765ef79d94"`);
        await queryRunner.query(`DROP TABLE "staff"`);
    }

}
