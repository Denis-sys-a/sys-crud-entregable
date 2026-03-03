import { Injectable } from '@nestjs/common';
import { Movie } from '../entities/movie.entity';

@Injectable()
export class MovieStore {
  private nextId = 4;
  private readonly items: Movie[] = [
    new Movie({
      id: 1,
      title: 'Interstellar',
      director: 'Christopher Nolan',
      genre: 'Ciencia ficción',
      year: 2014,
      durationMin: 169,
      classification: 'PG-13',
      synopsis: 'Viaje interestelar para salvar la humanidad.',
    }),
    new Movie({
      id: 2,
      title: 'Parasite',
      director: 'Bong Joon-ho',
      genre: 'Drama',
      year: 2019,
      durationMin: 132,
      classification: 'R',
      synopsis: 'Una familia se infiltra en una casa adinerada.',
    }),
    new Movie({
      id: 3,
      title: 'Terminator 2: El Juicio Final',
      director: 'James Cameron',
      genre: 'Acción',
      year: 1991,
      durationMin: 137,
      classification: 'NC-17',
      synopsis: 'Un cyborg protege al futuro líder de la resistencia.',
    }),
  ];

  list(): Movie[] {
    return this.items;
  }

  newId(): number {
    const id = this.nextId;
    this.nextId += 1;
    return id;
  }
}