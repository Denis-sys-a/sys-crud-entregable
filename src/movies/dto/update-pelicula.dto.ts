import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

type PeliculaClassificationDto = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

export class UpdatePeliculaDto {
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
  classification?: PeliculaClassificationDto;

  @IsOptional()
  @IsString()
  synopsis?: string;

  @IsOptional()
  @IsString()
  posterUrl?: string;
}