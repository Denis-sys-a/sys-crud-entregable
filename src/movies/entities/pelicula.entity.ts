export type PeliculaClassification = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

export class Pelicula {
  id: number;
  title: string;
  director: string;
  genre: string;
  year: number;
  durationMin: number;
  classification: PeliculaClassification;
  synopsis: string;
  posterUrl?: string;

  constructor(data: Omit<Pelicula, 'id'> & { id?: number }) {
    this.id = data.id ?? 0;
    this.title = data.title;
    this.director = data.director;
    this.genre = data.genre;
    this.year = data.year;
    this.durationMin = data.durationMin;
    this.classification = data.classification;
    this.synopsis = data.synopsis;
    this.posterUrl = data.posterUrl;
  }
}