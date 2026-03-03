import { Injectable } from '@nestjs/common';
import { Movie } from '../entities/movie.entity';
import { MovieStore } from './movie-store.singleton';
import { MovieRepository } from './movie.repository';

@Injectable()
export class InMemoryMovieRepository implements MovieRepository {
  constructor(private readonly store: MovieStore) {}

  async findAll(): Promise<Movie[]> {
    return [...this.store.list()];
  }

  async findById(id: number): Promise<Movie | null> {
    return this.store.list().find((movie) => movie.id === id) ?? null;
  }

  async create(movieData: Omit<Movie, 'id'>): Promise<Movie> {
    const created = new Movie({ ...movieData, id: this.store.newId() });
    this.store.list().push(created);
    return created;
  }

  async update(id: number, movieData: Partial<Omit<Movie, 'id'>>): Promise<Movie | null> {
    const movie = this.store.list().find((item) => item.id === id);
    if (!movie) {
      return null;
    }

    Object.assign(movie, movieData);
    return movie;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.store.list().findIndex((movie) => movie.id === id);
    if (index === -1) {
      return false;
    }

    this.store.list().splice(index, 1);
    return true;
  }
}