import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { Pelicula } from './entities/pelicula.entity';
import { PELICULA_REPOSITORY } from './repositories/pelicula.repository';
// `PeliculaRepository` es solo un tipo: usar `import type` evita TS1272 con decorators metadata.
import type { PeliculaRepository } from './repositories/pelicula.repository';
import {
  PeliculaSortStrategy,
  SortByDurationStrategy,
  SortByTitleStrategy,
  SortByYearStrategy,
} from './strategies/pelicula-sort.strategy';

@Injectable()
export class PeliculasService {
  constructor(
    @Inject(PELICULA_REPOSITORY)
    private readonly repository: PeliculaRepository,
  ) {}

  async findAll(orderBy = 'id'): Promise<Pelicula[]> {
    const peliculas = await this.repository.findAll();

    const strategy = this.getSortStrategy(orderBy);
    if (!strategy) {
      return peliculas;
    }

    return strategy.sort(peliculas);
  }

  async findOne(id: number): Promise<Pelicula> {
    const pelicula = await this.repository.findById(id);
    if (!pelicula) {
      throw new NotFoundException(`Película ${id} no encontrada`);
    }

    return pelicula;
  }

  create(dto: CreatePeliculaDto): Promise<Pelicula> {
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

  async update(id: number, dto: UpdatePeliculaDto): Promise<Pelicula> {
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

  private getSortStrategy(orderBy: string): PeliculaSortStrategy | null {
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