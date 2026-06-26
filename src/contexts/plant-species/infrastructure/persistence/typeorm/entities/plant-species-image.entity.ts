import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PlantSpeciesTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species.entity';

@Entity('plant_species_image')
@Index(['plantSpeciesId'])
export class PlantSpeciesImageTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'plant_species_id', type: 'uuid' })
  plantSpeciesId!: string;

  @ManyToOne(
    () => PlantSpeciesTypeOrmEntity,
    (plantSpecies) => plantSpecies.images,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'plant_species_id' })
  plantSpecies!: PlantSpeciesTypeOrmEntity;

  @Column({ type: 'varchar', length: 500 })
  url!: string;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary!: boolean;
}
