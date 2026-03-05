import { Pelicula } from '../entities/pelicula.entity';

export interface PeliculaSortStrategy {
  sort(peliculas: Pelicula[]): Pelicula[];
}

export class SortByTituloStrategy implements PeliculaSortStrategy {
  sort(peliculas: Pelicula[]): Pelicula[] {
    return [...peliculas].sort((a, b) => a.titulo.localeCompare(b.titulo));
  }
}

export class SortByAnioStrategy implements PeliculaSortStrategy {
  sort(peliculas: Pelicula[]): Pelicula[] {
    return [...peliculas].sort((a, b) => b.anio - a.anio);
  }
}

export class SortByDuracionStrategy implements PeliculaSortStrategy {
  sort(peliculas: Pelicula[]): Pelicula[] {
    return [...peliculas].sort((a, b) => b.duracionMin - a.duracionMin);
  }
}