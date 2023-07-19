import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1689784737057 implements MigrationInterface {
    name = 'Initial1689784737057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "song" ("videoId" character varying NOT NULL, "url" character varying NOT NULL, CONSTRAINT "PK_ce76de5356a0fe58106a4c23188" PRIMARY KEY ("videoId"))`);
        await queryRunner.query(`CREATE TABLE "lyrics" ("id" integer NOT NULL, "text" character varying NOT NULL, "start" integer NOT NULL, "end" integer NOT NULL, "songVideoId" character varying, CONSTRAINT "PK_f7c5de22ef94f309591c5554f0f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lyrics" ADD CONSTRAINT "FK_338465c91bfbbb8f160b949ca04" FOREIGN KEY ("songVideoId") REFERENCES "song"("videoId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lyrics" DROP CONSTRAINT "FK_338465c91bfbbb8f160b949ca04"`);
        await queryRunner.query(`DROP TABLE "lyrics"`);
        await queryRunner.query(`DROP TABLE "song"`);
    }

}
