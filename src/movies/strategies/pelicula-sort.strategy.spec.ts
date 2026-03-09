import {
  SortByAnioStrategy,
  SortByDuracionStrategy,
  SortByTituloStrategy,
} from './pelicula-sort.strategy';
import { Pelicula } from '../entities/pelicula.entity';

const buildMovie = (titulo: string, anio: number, duracionMin: number) =>
  new Pelicula({
    id: 0,
    titulo,
    director: 'Director',
    genero: 'Drama',
    anio,
    duracionMin,
    clasificacion: 'PG',
    estado: 'disponible',
    sinopsis: 'Sinopsis',
  });

describe('Pelicula sort strategies', () => {
  const movies = [
    buildMovie('Zeta', 2001, 120),
    buildMovie('Alpha', 2023, 95),
    buildMovie('Beta', 2010, 150),
  ];

  it('SortByTituloStrategy sorts ascending by title', () => {
    const sorted = new SortByTituloStrategy().sort(movies);

    expect(sorted.map((m) => m.titulo)).toEqual(['Alpha', 'Beta', 'Zeta']);
    expect(movies.map((m) => m.titulo)).toEqual(['Zeta', 'Alpha', 'Beta']);
  });

  it('SortByAnioStrategy sorts descending by year', () => {
    const sorted = new SortByAnioStrategy().sort(movies);

    expect(sorted.map((m) => m.anio)).toEqual([2023, 2010, 2001]);
  });

  it('SortByDuracionStrategy sorts descending by duration', () => {
    const sorted = new SortByDuracionStrategy().sort(movies);

    expect(sorted.map((m) => m.duracionMin)).toEqual([150, 120, 95]);
  });
});