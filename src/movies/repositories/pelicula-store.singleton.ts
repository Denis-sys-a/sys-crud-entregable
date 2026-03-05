import { Injectable } from '@nestjs/common';
import { Pelicula } from '../entities/pelicula.entity';

@Injectable()
export class PeliculaStore {
  private nextId = 4;
  private readonly items: Pelicula[] = [
    new Pelicula({
      id: 1,
      titulo: 'Interstellar',
      director: 'Christopher Nolan',
      genero: 'Ciencia ficción',
      anio: 2014,
      duracionMin: 169,
      clasificacion: 'PG-13',
      sinopsis: 'Viaje interestelar para salvar la humanidad.',
    }),
    new Pelicula({
      id: 2,
      titulo: 'Parasite',
      director: 'Bong Joon-ho',
      genero: 'Drama',
      anio: 2019,
      duracionMin: 132,
      clasificacion: 'R',
      sinopsis: 'Una familia se infiltra en una casa adinerada.',
    }),
    new Pelicula({
      id: 3,
      titulo: 'Terminator 2: El Juicio Final',
      director: 'James Cameron',
      genero: 'Acción',
      anio: 1991,
      duracionMin: 137,
      clasificacion: 'NC-17',
      sinopsis: 'Un cyborg protege al futuro líder de la resistencia.',
    }),
  ];

  list(): Pelicula[] {
    return this.items;
  }

  newId(): number {
    const id = this.nextId;
    this.nextId += 1;
    return id;
  }
}