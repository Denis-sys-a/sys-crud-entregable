export type PeliculaClassification = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
export type PeliculaEstado = 'disponible' | 'no disponible';

export class Pelicula {
  id: number;
  titulo: string;
  director: string;
  genero: string;
  anio: number;
  duracionMin: number;
  clasificacion: PeliculaClassification;
  estado: PeliculaEstado;
  sinopsis: string;
  posterUrl?: string;
  updatedAt?: Date;

  constructor(data: Omit<Pelicula, 'id'> & { id?: number }) {
    this.id = data.id ?? 0;
    this.titulo = data.titulo;
    this.director = data.director;
    this.genero = data.genero;
    this.anio = data.anio;
    this.duracionMin = data.duracionMin;
    this.clasificacion = data.clasificacion;
    this.estado = data.estado;
    this.sinopsis = data.sinopsis;
    this.posterUrl = data.posterUrl;
    this.updatedAt = data.updatedAt;
  }
}