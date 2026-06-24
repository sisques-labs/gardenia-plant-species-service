import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PlantSpeciesTypeOrmEntity } from '@contexts/plant-species/infrastructure/persistence/typeorm/entities/plant-species.entity';

@Entity('plant_species_common_name')
@Index(['plantSpeciesId'])
export class PlantSpeciesCommonNameTypeOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'plant_species_id', type: 'uuid' })
  plantSpeciesId!: string;

  @ManyToOne(
    () => PlantSpeciesTypeOrmEntity,
    (plantSpecies) => plantSpecies.commonNames,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'plant_species_id' })
  plantSpecies!: PlantSpeciesTypeOrmEntity;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  language!: string | null;

  @Column({ type: 'varchar', length: 32 })
  source!: string;
}
