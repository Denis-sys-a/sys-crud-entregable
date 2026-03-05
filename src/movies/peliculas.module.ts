import { Module } from '@nestjs/common';
import { PeliculasController } from './peliculas.controller';
import { InMemoryPeliculaRepository } from './repositories/in-memory-pelicula.repository';
import { PELICULA_REPOSITORY } from './repositories/pelicula.repository';
import { PeliculaStore } from './repositories/pelicula-store.singleton';
import { PeliculasService } from './peliculas.service';

@Module({
  controllers: [PeliculasController],
  providers: [
    PeliculaStore,
    PeliculasService,
    {
      provide: PELICULA_REPOSITORY,
      useClass: InMemoryPeliculaRepository,
    },
  ],
})
export class PeliculasModule {}