import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { CreatePeliculaDto } from './dto/create-pelicula.dto';
import { UpdatePeliculaDto } from './dto/update-pelicula.dto';
import { PeliculasService } from './peliculas.service';

const posterDirectory = join(process.cwd(), 'public', 'img');

function ensurePosterDirectory() {
  if (!existsSync(posterDirectory)) {
    mkdirSync(posterDirectory, { recursive: true });
  }
}

@Controller('api/peliculas')
export class PeliculasController {
  constructor(private readonly peliculasService: PeliculasService) {}

  @Get()
  findAll(@Query('orderBy') orderBy?: string) {
    return this.peliculasService.findAll(orderBy);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.peliculasService.findOne(id);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('poster', {
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          ensurePosterDirectory();
          callback(null, posterDirectory);
        },
        filename: (_request, file, callback) => {
          const extension = extname(file.originalname).toLowerCase();
          const safeBaseName = file.originalname
            .replace(extension, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
          const timestamp = Date.now();
          callback(null, `${safeBaseName || 'poster'}-${timestamp}${extension}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadPoster(@UploadedFile() file?: { mimetype: string; filename: string }) {
    if (!file) {
      throw new BadRequestException('Debes subir una imagen válida.');
    }

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Formato no permitido. Usa JPG, PNG o WEBP.');
    }

    return { posterUrl: `/img/${file.filename}` };
  }

  @Post()
  create(@Body() createPeliculaDto: CreatePeliculaDto) {
    return this.peliculasService.create(createPeliculaDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePeliculaDto: UpdatePeliculaDto,
  ) {
    return this.peliculasService.update(id, updatePeliculaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.peliculasService.remove(id);
  }
}