import { existsSync, readFileSync } from 'fs';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeliculaOrmEntity } from './movies/entities/pelicula.orm-entity';
import { PeliculasModule } from './movies/peliculas.module';

function loadEnvFile() {
  const envPath = '.env';
  if (!existsSync(envPath)) return;

  const file = readFileSync(envPath, 'utf8');
  file
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .forEach((line) => {
      const separatorIndex = line.indexOf('=');
      if (separatorIndex <= 0) return;

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      if (!process.env[key]) {
        process.env[key] = value;
      }
    });
}

loadEnvFile();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 3306),
      username: process.env.DB_USER ?? 'root',
      password: process.env.DB_PASS ?? '',
      database: process.env.DB_NAME ?? 'bd_peliculas',
      entities: [PeliculaOrmEntity],
      synchronize: false,
    }),
    PeliculasModule,
  ],
})
export class AppModule {}