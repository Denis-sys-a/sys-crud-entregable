import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { MovieClassification } from '../entities/movie.entity';

export class UpdateMovieDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsInt()
  @Min(1888)
  @Max(2100)
  year?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(600)
  durationMin?: number;

  @IsOptional()
  @IsString()
  classification?: MovieClassification;

  @IsOptional()
  @IsString()
  synopsis?: string;

  @IsOptional()
  @IsString()
  posterUrl?: string;
}