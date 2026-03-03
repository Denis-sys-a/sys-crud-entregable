import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { InMemoryMovieRepository } from './repositories/in-memory-movie.repository';
import { MOVIE_REPOSITORY } from './repositories/movie.repository';
import { MovieStore } from './repositories/movie-store.singleton';
import { MoviesService } from './movies.service';

@Module({
  controllers: [MoviesController],
  providers: [
    MovieStore,
    MoviesService,
    {
      provide: MOVIE_REPOSITORY,
      useClass: InMemoryMovieRepository,
    },
  ],
})
export class MoviesModule {}