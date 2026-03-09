import { NotFoundException } from '@nestjs/common';
import { PeliculasService } from './peliculas.service';
import type { PeliculaRepository } from './repositories/pelicula.repository';
import { Pelicula } from './entities/pelicula.entity';

describe('PeliculasService', () => {
  let service: PeliculasService;
  let repository: jest.Mocked<PeliculaRepository>;

  const buildMovie = (id: number, titulo: string, anio: number, duracionMin: number): Pelicula =>
    new Pelicula({
      id,
      titulo,
      director: 'Director',
      genero: 'Sci-Fi',
      anio,
      duracionMin,
      clasificacion: 'PG-13',
      estado: 'disponible',
      sinopsis: 'Sinopsis',
      posterUrl: '/img/poster.jpg',
    });

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new PeliculasService(repository);
  });

  it('returns movies sorted by title when orderBy=titulo', async () => {
    repository.findAll.mockResolvedValue([
      buildMovie(1, 'Zeta', 2020, 100),
      buildMovie(2, 'Alpha', 2019, 90),
    ]);

    const result = await service.findAll('titulo');

    expect(result.map((p) => p.titulo)).toEqual(['Alpha', 'Zeta']);
  });

  it('returns movies unsorted for unknown orderBy', async () => {
    const movies = [buildMovie(1, 'B', 2020, 100), buildMovie(2, 'A', 2021, 90)];
    repository.findAll.mockResolvedValue(movies);

    const result = await service.findAll('desconocido');

    expect(result).toEqual(movies);
  });

  it('throws NotFoundException when findOne cannot find the movie', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('delegates create to repository with mapped dto fields', async () => {
    const dto = {
      titulo: 'Interstellar',
      director: 'Nolan',
      genero: 'Sci-Fi',
      anio: 2014,
      duracionMin: 169,
      clasificacion: 'PG-13' as const,
      estado: 'disponible' as const,
      sinopsis: 'Viaje espacial',
      posterUrl: '/img/interstellar.jpg',
    };
    const created = buildMovie(10, dto.titulo, dto.anio, dto.duracionMin);
    repository.create.mockResolvedValue(created);

    const result = await service.create(dto);

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(created);
  });

  it('throws NotFoundException when update target does not exist', async () => {
    repository.update.mockResolvedValue(null);

    await expect(service.update(7, { titulo: 'Nuevo título' })).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException when remove target does not exist', async () => {
    repository.delete.mockResolvedValue(false);

    await expect(service.remove(7)).rejects.toThrow(NotFoundException);
  });
});