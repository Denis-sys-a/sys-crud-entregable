import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { MovieClassification } from '../entities/movie.entity';

export class CreateMovieDto {
  @IsString()
  title!: string;

  @IsString()
  director!: string;

  @IsString()
  genre!: string;

  @IsInt()
  @Min(1888)
  @Max(2100)
  year!: number;

  @IsInt()
  @Min(1)
  @Max(600)
  durationMin!: number;

  @IsString()
  classification!: MovieClassification;

  @IsString()
  synopsis!: string;

  @IsOptional()
  @IsString()
  posterUrl?: string;
}