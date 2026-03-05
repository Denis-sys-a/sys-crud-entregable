import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

type PeliculaClassificationDto = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

export class CreatePeliculaDto {
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
  classification!: PeliculaClassificationDto;

  @IsString()
  synopsis!: string;

  @IsOptional()
  @IsString()
  posterUrl?: string;
}