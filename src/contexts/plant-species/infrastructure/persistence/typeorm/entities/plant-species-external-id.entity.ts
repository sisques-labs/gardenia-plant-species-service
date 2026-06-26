import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { PlantSpeciesTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species.entity';

@Entity('plant_species_external_id')
@Index(['plantSpeciesId'])
@Unique(['plantSpeciesId', 'scheme'])
export class PlantSpeciesExternalIdTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'plant_species_id', type: 'uuid' })
  plantSpeciesId!: string;

  @ManyToOne(
    () => PlantSpeciesTypeOrmEntity,
    (plantSpecies) => plantSpecies.externalIds,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'plant_species_id' })
  plantSpecies!: PlantSpeciesTypeOrmEntity;

  @Column({ type: 'varchar', length: 32 })
  scheme!: string;

  @Column({ type: 'varchar', length: 255 })
  value!: string;
}
