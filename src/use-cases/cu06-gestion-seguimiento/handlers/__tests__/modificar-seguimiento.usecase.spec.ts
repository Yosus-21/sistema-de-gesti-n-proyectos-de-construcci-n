import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Seguimiento } from '../../../../domain';
import type { SeguimientoRepository } from '../../../../infrastructure';
import { ModificarSeguimientoUseCase } from '../modificar-seguimiento.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('ModificarSeguimientoUseCase', () => {
  let useCase: ModificarSeguimientoUseCase;
  let seguimientoRepositoryMock: jest.Mocked<SeguimientoRepository>;

  const seguimientoBase = new Seguimiento({
    idSeguimiento: 22,
    idTarea: 8,
    fechaSeguimiento: new Date('2026-05-12T00:00:00.000Z'),
    estadoReportado: 'En curso',
    cantidadMaterialUsado: 10,
    porcentajeAvance: 35,
    observaciones: 'Base',
  });

  beforeEach(() => {
    seguimientoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ModificarSeguimientoUseCase(seguimientoRepositoryMock);
  });

  it('modifica seguimiento existente', async () => {
    seguimientoRepositoryMock.findById.mockResolvedValue(seguimientoBase);
    seguimientoRepositoryMock.update.mockResolvedValue(
      new Seguimiento({
        ...seguimientoBase,
        porcentajeAvance: 60,
        observaciones: 'Actualizado',
        fechaSeguimiento: new Date('2026-05-13T00:00:00.000Z'),
      }),
    );

    const result = await useCase.execute({
      idSeguimiento: 22,
      porcentajeAvance: 60,
      observaciones: 'Actualizado',
      fechaSeguimiento: '2026-05-13T00:00:00.000Z',
    });

    expect(seguimientoRepositoryMock.update).toHaveBeenCalledWith(
      22,
      expect.objectContaining({
        porcentajeAvance: 60,
        observaciones: 'Actualizado',
        fechaSeguimiento: expectAnyDate(),
      }),
    );
    expect(result.idSeguimiento).toBe(22);
  });

  it('lanza NotFoundException si no existe', async () => {
    seguimientoRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idSeguimiento: 404,
        observaciones: 'No importa',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza BadRequestException si porcentajeAvance esta fuera de rango', async () => {
    seguimientoRepositoryMock.findById.mockResolvedValue(seguimientoBase);

    await expect(
      useCase.execute({
        idSeguimiento: 22,
        porcentajeAvance: 101,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
