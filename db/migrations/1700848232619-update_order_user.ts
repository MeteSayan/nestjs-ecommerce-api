import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderUser1700848232619 implements MigrationInterface {
    name = 'UpdateOrderUser1700848232619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "created_by_id" integer`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_f93cc7892226abb9c88e7131381" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_f93cc7892226abb9c88e7131381"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "created_by_id"`);
    }

}
