import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('peliculas')
export class PeliculaOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'varchar', length: 255 })
  director: string;

  @Column({ type: 'varchar', length: 120 })
  genero: string;

  @Column({ type: 'int' })
  anio: number;

  @Column({ type: 'int', name: 'duracion_min' })
  duracionMin: number;

  @Column({
    type: 'enum',
    enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
  })
  clasificacion: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

  @Column({ type: 'text' })
  sinopsis: string;

  @Column({ type: 'longtext', name: 'poster_data', nullable: true })
  posterData?: string;

  @Column({ type: 'varchar', name: 'poster_mime_type', length: 50, nullable: true })
  posterMimeType?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}