import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLyricDecimal1689814342881 implements MigrationInterface {
    name = 'UpdateLyricDecimal1689814342881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lyrics" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "lyrics" ADD "start" numeric(6,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "lyrics" DROP COLUMN "end"`);
        await queryRunner.query(`ALTER TABLE "lyrics" ADD "end" numeric(6,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lyrics" DROP COLUMN "end"`);
        await queryRunner.query(`ALTER TABLE "lyrics" ADD "end" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "lyrics" DROP COLUMN "start"`);
        await queryRunner.query(`ALTER TABLE "lyrics" ADD "start" integer NOT NULL DEFAULT '0'`);
    }

}
