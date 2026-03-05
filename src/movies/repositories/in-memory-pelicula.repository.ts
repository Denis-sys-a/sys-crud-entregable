import { Injectable } from '@nestjs/common';
import { Pelicula } from '../entities/pelicula.entity';
import { PeliculaStore } from './pelicula-store.singleton';
import { PeliculaRepository } from './pelicula.repository';

@Injectable()
export class InMemoryPeliculaRepository implements PeliculaRepository {
  constructor(private readonly store: PeliculaStore) {}

  async findAll(): Promise<Pelicula[]> {
    return [...this.store.list()];
  }

  async findById(id: number): Promise<Pelicula | null> {
    return this.store.list().find((pelicula) => pelicula.id === id) ?? null;
  }

  async create(peliculaData: Omit<Pelicula, 'id'>): Promise<Pelicula> {
    const created = new Pelicula({ ...peliculaData, id: this.store.newId() });
    this.store.list().push(created);
    return created;
  }

  async update(id: number, peliculaData: Partial<Omit<Pelicula, 'id'>>): Promise<Pelicula | null> {
    const pelicula = this.store.list().find((item) => item.id === id);
    if (!pelicula) {
      return null;
    }

    Object.assign(pelicula, peliculaData);
    return pelicula;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.store.list().findIndex((pelicula) => pelicula.id === id);
    if (index === -1) {
      return false;
    }

    this.store.list().splice(index, 1);
    return true;
  }
}