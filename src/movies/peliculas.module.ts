import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeliculasController } from './peliculas.controller';
import { PeliculaOrmEntity } from './entities/pelicula.orm-entity';
import { PeliculasService } from './peliculas.service';
import { MySqlPeliculaRepository } from './repositories/mysql-pelicula.repository';
import { PELICULA_REPOSITORY } from './repositories/pelicula.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PeliculaOrmEntity])],
  controllers: [PeliculasController],
  providers: [
    PeliculasService,
    {
      provide: PELICULA_REPOSITORY,
      useClass: MySqlPeliculaRepository,
    },
  ],
})
export class PeliculasModule {}