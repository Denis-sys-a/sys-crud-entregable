import { Pelicula } from '../entities/pelicula.entity';

export interface PeliculaRepository {
  findAll(): Promise<Pelicula[]>;
  findById(id: number): Promise<Pelicula | null>;
  create(pelicula: Omit<Pelicula, 'id'>): Promise<Pelicula>;
  update(id: number, pelicula: Partial<Omit<Pelicula, 'id'>>): Promise<Pelicula | null>;
  delete(id: number): Promise<boolean>;
}

export const PELICULA_REPOSITORY = 'PeliculaRepository';