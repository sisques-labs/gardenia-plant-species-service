import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePlantSpecies1782288900576 implements MigrationInterface {
    name = 'CreatePlantSpecies1782288900576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "plant_species" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scientific_name" character varying(300) NOT NULL, "description" character varying(2000), "image_url" character varying(500), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_696c87caf7d18f1f346c3728a0a" UNIQUE ("scientific_name"), CONSTRAINT "PK_1b66e1a64cc1c6921695c08116f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "plant_species"`);
    }

}
