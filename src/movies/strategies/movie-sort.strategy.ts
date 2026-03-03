import { Movie } from '../entities/movie.entity';

export interface MovieSortStrategy {
  sort(movies: Movie[]): Movie[];
}

export class SortByTitleStrategy implements MovieSortStrategy {
  sort(movies: Movie[]): Movie[] {
    return [...movies].sort((a, b) => a.title.localeCompare(b.title));
  }
}

export class SortByYearStrategy implements MovieSortStrategy {
  sort(movies: Movie[]): Movie[] {
    return [...movies].sort((a, b) => b.year - a.year);
  }
}

export class SortByDurationStrategy implements MovieSortStrategy {
  sort(movies: Movie[]): Movie[] {
    return [...movies].sort((a, b) => b.durationMin - a.durationMin);
  }
}