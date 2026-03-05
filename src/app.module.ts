import { Module } from '@nestjs/common';
import { PeliculasModule } from './movies/peliculas.module';

@Module({
  imports: [PeliculasModule],
})
export class AppModule {}