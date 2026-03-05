import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

type PeliculaClassificationDto = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

export class UpdatePeliculaDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsString()
  genero?: string;

  @IsOptional()
  @IsInt()
  @Min(1888)
  @Max(2100)
  anio?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(600)
  duracionMin?: number;

  @IsOptional()
  @IsString()
  clasificacion?: PeliculaClassificationDto;

  @IsOptional()
  @IsString()
  sinopsis?: string;

  @IsOptional()
  @IsString()
  posterUrl?: string;
}