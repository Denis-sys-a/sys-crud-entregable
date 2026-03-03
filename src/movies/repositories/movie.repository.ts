import { Movie } from '../entities/movie.entity';

export interface MovieRepository {
  findAll(): Promise<Movie[]>;
  findById(id: number): Promise<Movie | null>;
  create(movie: Omit<Movie, 'id'>): Promise<Movie>;
  update(id: number, movie: Partial<Omit<Movie, 'id'>>): Promise<Movie | null>;
  delete(id: number): Promise<boolean>;
}

export const MOVIE_REPOSITORY = 'MovieRepository';