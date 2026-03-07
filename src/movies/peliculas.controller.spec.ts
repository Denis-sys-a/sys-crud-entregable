import { BadRequestException } from '@nestjs/common';
import { PeliculasController } from './peliculas.controller';
import type { PeliculasService } from './peliculas.service';

describe('PeliculasController', () => {
  let controller: PeliculasController;
  let service: jest.Mocked<PeliculasService>;

  beforeEach(() => {
    service = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<PeliculasService>;

    controller = new PeliculasController(service);
  });

  it('delegates findAll with orderBy query parameter', async () => {
    service.findAll.mockResolvedValue([]);

    await controller.findAll('anio');

    expect(service.findAll).toHaveBeenCalledWith('anio');
  });

  it('throws BadRequestException when no file was uploaded', () => {
    expect(() => controller.uploadPoster()).toThrow(BadRequestException);
  });

  it('throws BadRequestException when uploaded file has invalid mime type', () => {
    expect(() =>
      controller.uploadPoster({
        mimetype: 'application/pdf',
        filename: 'archivo.pdf',
      }),
    ).toThrow(BadRequestException);
  });

  it('returns posterUrl when uploaded file mime type is valid', () => {
    const response = controller.uploadPoster({
      mimetype: 'image/png',
      filename: 'poster-123.png',
    });

    expect(response).toEqual({ posterUrl: '/img/poster-123.png' });
  });
});