import { Pelicula } from '../entities/pelicula.entity';

export interface PeliculaSortStrategy {
  sort(peliculas: Pelicula[]): Pelicula[];
}

export class SortByTitleStrategy implements PeliculaSortStrategy {
  sort(peliculas: Pelicula[]): Pelicula[] {
    return [...peliculas].sort((a, b) => a.title.localeCompare(b.title));
  }
}

export class SortByYearStrategy implements PeliculaSortStrategy {
  sort(peliculas: Pelicula[]): Pelicula[] {
    return [...peliculas].sort((a, b) => b.year - a.year);
  }
}

export class SortByDurationStrategy implements PeliculaSortStrategy {
  sort(peliculas: Pelicula[]): Pelicula[] {
    return [...peliculas].sort((a, b) => b.durationMin - a.durationMin);
  }
}