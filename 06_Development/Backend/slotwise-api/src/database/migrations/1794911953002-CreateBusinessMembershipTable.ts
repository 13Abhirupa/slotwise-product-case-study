import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBusinessMembershipTable1794911953002 implements MigrationInterface {
    name = 'CreateBusinessMembershipTable1794911953002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "business_membership" ("membership_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "business_id" uuid NOT NULL, "user_id" uuid NOT NULL, "role" character varying(30) NOT NULL, "membership_status" character varying(20) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_business_membership_business_user" UNIQUE ("business_id", "user_id"), CONSTRAINT "PK_07d09829ea8b9b0b5024314a36b" PRIMARY KEY ("membership_id"))`);
        await queryRunner.query(`ALTER TABLE "business_membership" ADD CONSTRAINT "FK_201b6826372d5168c3727592e8b" FOREIGN KEY ("business_id") REFERENCES "business"("business_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "business_membership" ADD CONSTRAINT "FK_260ffaab4025a74461aa82134c8" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "business_membership" DROP CONSTRAINT "FK_260ffaab4025a74461aa82134c8"`);
        await queryRunner.query(`ALTER TABLE "business_membership" DROP CONSTRAINT "FK_201b6826372d5168c3727592e8b"`);
        await queryRunner.query(`DROP TABLE "business_membership"`);
    }

}
