import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExpandPlantSpeciesModel1782289000000 implements MigrationInterface {
  name = 'ExpandPlantSpeciesModel1782289000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- New scalar columns on plant_species (taxonomy, authorship, ecology) ---
    await queryRunner.query(`
      ALTER TABLE "plant_species"
        ADD COLUMN "kingdom" character varying(255),
        ADD COLUMN "phylum" character varying(255),
        ADD COLUMN "taxon_class" character varying(255),
        ADD COLUMN "taxon_order" character varying(255),
        ADD COLUMN "family" character varying(255),
        ADD COLUMN "genus" character varying(255),
        ADD COLUMN "specific_epithet" character varying(255),
        ADD COLUMN "taxon_rank" character varying(255),
        ADD COLUMN "name_authorship" character varying(255),
        ADD COLUMN "name_published_in_year" integer,
        ADD COLUMN "growth_habit" character varying(32),
        ADD COLUMN "wikipedia_url" character varying(500)
    `);

    // --- Child table: common (vernacular) names ---
    await queryRunner.query(`
      CREATE TABLE "plant_species_common_name" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "plant_species_id" uuid NOT NULL,
        "name" character varying(255) NOT NULL,
        "language" character varying(16),
        CONSTRAINT "PK_plant_species_common_name" PRIMARY KEY ("id"),
        CONSTRAINT "FK_plant_species_common_name_species" FOREIGN KEY ("plant_species_id")
          REFERENCES "plant_species" ("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_plant_species_common_name_species" ON "plant_species_common_name" ("plant_species_id")`,
    );

    // --- Child table: images / gallery ---
    await queryRunner.query(`
      CREATE TABLE "plant_species_image" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "plant_species_id" uuid NOT NULL,
        "url" character varying(500) NOT NULL,
        "is_primary" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_plant_species_image" PRIMARY KEY ("id"),
        CONSTRAINT "FK_plant_species_image_species" FOREIGN KEY ("plant_species_id")
          REFERENCES "plant_species" ("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_plant_species_image_species" ON "plant_species_image" ("plant_species_id")`,
    );

    // --- Child table: external identifiers (free-form scheme + value) ---
    await queryRunner.query(`
      CREATE TABLE "plant_species_external_id" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "plant_species_id" uuid NOT NULL,
        "scheme" character varying(32) NOT NULL,
        "value" character varying(255) NOT NULL,
        CONSTRAINT "PK_plant_species_external_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_plant_species_external_id_scheme" UNIQUE ("plant_species_id", "scheme"),
        CONSTRAINT "FK_plant_species_external_id_species" FOREIGN KEY ("plant_species_id")
          REFERENCES "plant_species" ("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_plant_species_external_id_species" ON "plant_species_external_id" ("plant_species_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "plant_species_external_id"`);
    await queryRunner.query(`DROP TABLE "plant_species_image"`);
    await queryRunner.query(`DROP TABLE "plant_species_common_name"`);
    await queryRunner.query(`
      ALTER TABLE "plant_species"
        DROP COLUMN "wikipedia_url",
        DROP COLUMN "growth_habit",
        DROP COLUMN "name_published_in_year",
        DROP COLUMN "name_authorship",
        DROP COLUMN "taxon_rank",
        DROP COLUMN "specific_epithet",
        DROP COLUMN "genus",
        DROP COLUMN "family",
        DROP COLUMN "taxon_order",
        DROP COLUMN "taxon_class",
        DROP COLUMN "phylum",
        DROP COLUMN "kingdom"
    `);
  }
}
