import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pelicula } from '../entities/pelicula.entity';
import { PeliculaOrmEntity } from '../entities/pelicula.orm-entity';
import { PeliculaRepository } from './pelicula.repository';

@Injectable()
export class MySqlPeliculaRepository implements PeliculaRepository {
  constructor(
    @InjectRepository(PeliculaOrmEntity)
    private readonly repo: Repository<PeliculaOrmEntity>,
  ) {}

  async findAll(): Promise<Pelicula[]> {
    const rows = await this.repo.find({ order: { id: 'ASC' } });
    return rows.map((row) => this.toDomain(row));
  }

  async findById(id: number): Promise<Pelicula | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async create(peliculaData: Omit<Pelicula, 'id'>): Promise<Pelicula> {
    const row = this.repo.create(this.toRowData(peliculaData));
    const saved = await this.repo.save(row);
    return this.toDomain(saved);
  }

  async update(id: number, peliculaData: Partial<Omit<Pelicula, 'id'>>): Promise<Pelicula | null> {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    const merged = this.repo.merge(existing, this.toRowData(peliculaData));
    const saved = await this.repo.save(merged);
    return this.toDomain(saved);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  private toDomain(row: PeliculaOrmEntity): Pelicula {
    return new Pelicula({
      id: row.id,
      titulo: row.titulo,
      director: row.director,
      genero: row.genero,
      anio: row.anio,
      duracionMin: row.duracionMin,
      clasificacion: row.clasificacion,
      estado: row.estado,
      sinopsis: row.sinopsis,
      posterUrl: row.posterData,
      updatedAt: row.updatedAt,
    });
  }

  private toRowData(
    peliculaData: Partial<Omit<Pelicula, 'id'>>,
  ): Partial<PeliculaOrmEntity> {
    const row: Partial<PeliculaOrmEntity> = {};

    if (peliculaData.titulo !== undefined) row.titulo = peliculaData.titulo;
    if (peliculaData.director !== undefined) row.director = peliculaData.director;
    if (peliculaData.genero !== undefined) row.genero = peliculaData.genero;
    if (peliculaData.anio !== undefined) row.anio = peliculaData.anio;
    if (peliculaData.duracionMin !== undefined) row.duracionMin = peliculaData.duracionMin;
    if (peliculaData.clasificacion !== undefined) row.clasificacion = peliculaData.clasificacion;
    if (peliculaData.estado !== undefined) row.estado = peliculaData.estado;
    if (peliculaData.sinopsis !== undefined) row.sinopsis = peliculaData.sinopsis;
    if (peliculaData.posterUrl !== undefined) row.posterData = peliculaData.posterUrl;

    return row;
  }
}