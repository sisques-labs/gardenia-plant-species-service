import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { PlantSpeciesCommonNameTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species-common-name.entity';
import { PlantSpeciesExternalIdTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species-external-id.entity';
import { PlantSpeciesImageTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species-image.entity';

@Entity('plant_species')
@Unique(['scientificName'])
export class PlantSpeciesTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'scientific_name',
    type: 'varchar',
    length: 300,
    nullable: false,
  })
  scientificName!: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  description!: string | null;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl!: string | null;

  // --- Taxonomy (Linnaean classification + authorship) ---

  @Column({ type: 'varchar', length: 255, nullable: true })
  kingdom!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phylum!: string | null;

  @Column({ name: 'taxon_class', type: 'varchar', length: 255, nullable: true })
  taxonClass!: string | null;

  @Column({ name: 'taxon_order', type: 'varchar', length: 255, nullable: true })
  taxonOrder!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  family!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  genus!: string | null;

  @Column({
    name: 'specific_epithet',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  specificEpithet!: string | null;

  @Column({ name: 'taxon_rank', type: 'varchar', length: 255, nullable: true })
  taxonRank!: string | null;

  @Column({
    name: 'name_authorship',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  nameAuthorship!: string | null;

  @Column({ name: 'name_published_in_year', type: 'int', nullable: true })
  namePublishedInYear!: number | null;

  // --- Ecology / links ---

  @Column({ name: 'growth_habit', type: 'varchar', length: 32, nullable: true })
  growthHabit!: string | null;

  @Column({
    name: 'wikipedia_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  wikipediaUrl!: string | null;

  // --- Child collections (loaded eagerly, cascaded on save) ---

  @OneToMany(
    () => PlantSpeciesCommonNameTypeOrmEntity,
    (commonName) => commonName.plantSpecies,
    { cascade: true, eager: true, orphanedRowAction: 'delete' },
  )
  commonNames!: PlantSpeciesCommonNameTypeOrmEntity[];

  @OneToMany(
    () => PlantSpeciesImageTypeOrmEntity,
    (image) => image.plantSpecies,
    {
      cascade: true,
      eager: true,
      orphanedRowAction: 'delete',
    },
  )
  images!: PlantSpeciesImageTypeOrmEntity[];

  @OneToMany(
    () => PlantSpeciesExternalIdTypeOrmEntity,
    (externalId) => externalId.plantSpecies,
    { cascade: true, eager: true, orphanedRowAction: 'delete' },
  )
  externalIds!: PlantSpeciesExternalIdTypeOrmEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt!: Date;
}
