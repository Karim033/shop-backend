import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeletedAt1725455925199 implements MigrationInterface {
    name = 'AddDeletedAt1725455925199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payment"
            ADD "deletatedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "category"
            ADD "deletatedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "product"
            ADD "deletatedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "order_item"
            ADD "deletatedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "order"
            ADD "deletatedAt" TIMESTAMP
        `);
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD "deletatedAt" TIMESTAMP
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "deletatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "order" DROP COLUMN "deletatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "order_item" DROP COLUMN "deletatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "product" DROP COLUMN "deletatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "category" DROP COLUMN "deletatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment" DROP COLUMN "deletatedAt"
        `);
    }

}
