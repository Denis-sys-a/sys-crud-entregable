import { MySqlPeliculaRepository } from './mysql-pelicula.repository';
import type { Repository } from 'typeorm';
import type { PeliculaOrmEntity } from '../entities/pelicula.orm-entity';

describe('MySqlPeliculaRepository', () => {
  let repository: MySqlPeliculaRepository;
  let repoMock: jest.Mocked<Repository<PeliculaOrmEntity>>;

  beforeEach(() => {
    repoMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<PeliculaOrmEntity>>;

    repository = new MySqlPeliculaRepository(repoMock);
  });

  it('maps rows from findAll into domain entities', async () => {
    repoMock.find.mockResolvedValue([
      {
        id: 1,
        titulo: 'Interstellar',
        director: 'Nolan',
        genero: 'Sci-Fi',
        anio: 2014,
        duracionMin: 169,
        clasificacion: 'PG-13',
        sinopsis: 'Viaje',
        posterData: '/img/interstellar.jpg',
      } as PeliculaOrmEntity,
    ]);

    const result = await repository.findAll();

    expect(result[0]).toMatchObject({
      id: 1,
      titulo: 'Interstellar',
      posterUrl: '/img/interstellar.jpg',
    });
  });

  it('returns null from update when entity does not exist', async () => {
    repoMock.findOne.mockResolvedValue(null);

    const result = await repository.update(99, { titulo: 'Nuevo título' });

    expect(result).toBeNull();
    expect(repoMock.save).not.toHaveBeenCalled();
  });

  it('maps posterUrl to posterData during create', async () => {
    const payload = {
      titulo: 'Blade Runner',
      director: 'Ridley Scott',
      genero: 'Sci-Fi',
      anio: 1982,
      duracionMin: 117,
      clasificacion: 'R' as const,
      sinopsis: 'Replicantes',
      posterUrl: '/img/br.jpg',
    };

    repoMock.create.mockImplementation((value) => value as PeliculaOrmEntity);
    repoMock.save.mockImplementation(async (value) =>
      ({
        id: 4,
        ...value,
      }) as PeliculaOrmEntity,
    );

    const result = await repository.create(payload);

    expect(repoMock.create).toHaveBeenCalledWith(
      expect.objectContaining({ posterData: '/img/br.jpg' }),
    );
    expect(result.posterUrl).toBe('/img/br.jpg');
  });

  it('returns true when delete affects one row', async () => {
    repoMock.delete.mockResolvedValue({ affected: 1 } as never);

    const result = await repository.delete(1);

    expect(result).toBe(true);
  });
});