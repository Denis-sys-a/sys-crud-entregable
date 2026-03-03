import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MOVIE_REPOSITORY } from './repositories/movie.repository';
// `MovieRepository` es solo un tipo: usar `import type` evita TS1272 con decorators metadata.
import type { MovieRepository } from './repositories/movie.repository';
import {
  MovieSortStrategy,
  SortByDurationStrategy,
  SortByTitleStrategy,
  SortByYearStrategy,
} from './strategies/movie-sort.strategy';

@Injectable()
export class MoviesService {
  constructor(
    @Inject(MOVIE_REPOSITORY)
    private readonly repository: MovieRepository,
  ) {}

  async findAll(orderBy = 'id'): Promise<Movie[]> {
    const movies = await this.repository.findAll();

    const strategy = this.getSortStrategy(orderBy);
    if (!strategy) {
      return movies;
    }

    return strategy.sort(movies);
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.repository.findById(id);
    if (!movie) {
      throw new NotFoundException(`Película ${id} no encontrada`);
    }

    return movie;
  }

  create(dto: CreateMovieDto): Promise<Movie> {
    return this.repository.create({
      title: dto.title,
      director: dto.director,
      genre: dto.genre,
      year: dto.year,
      durationMin: dto.durationMin,
      classification: dto.classification,
      synopsis: dto.synopsis,
      posterUrl: dto.posterUrl,
    });
  }

  async update(id: number, dto: UpdateMovieDto): Promise<Movie> {
    const updated = await this.repository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Película ${id} no encontrada`);
    }

    return updated;
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Película ${id} no encontrada`);
    }
  }

  private getSortStrategy(orderBy: string): MovieSortStrategy | null {
    switch (orderBy) {
      case 'title':
        return new SortByTitleStrategy();
      case 'year':
        return new SortByYearStrategy();
      case 'duration':
        return new SortByDurationStrategy();
      default:
        return null;
    }
  }
}