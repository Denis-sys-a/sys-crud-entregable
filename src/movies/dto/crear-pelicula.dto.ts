import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

type PeliculaClassificationDto = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
type PeliculaEstadoDto = 'disponible' | 'no disponible';

export class CreatePeliculaDto {
  @IsString()
  titulo!: string;

  @IsString()
  director!: string;

  @IsString()
  genero!: string;

  @IsInt()
  @Min(1888)
  @Max(2100)
  anio!: number;

  @IsInt()
  @Min(1)
  @Max(600)
  duracionMin!: number;

  @IsString()
  clasificacion!: PeliculaClassificationDto;

  @IsOptional()
  @IsString()
  @IsIn(['disponible', 'no disponible'])
  estado!: PeliculaEstadoDto;

  @IsString()
  sinopsis!: string;

  @IsOptional()
  @IsString()
  posterUrl?: string;
}