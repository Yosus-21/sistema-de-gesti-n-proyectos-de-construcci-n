import { NotFoundException } from '@nestjs/common';
import { Seguimiento } from '../../../../domain';
import type { SeguimientoRepository } from '../../../../infrastructure';
import { ConsultarSeguimientoUseCase } from '../consultar-seguimiento.usecase';

describe('ConsultarSeguimientoUseCase', () => {
  let useCase: ConsultarSeguimientoUseCase;
  let seguimientoRepositoryMock: jest.Mocked<SeguimientoRepository>;

  beforeEach(() => {
    seguimientoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ConsultarSeguimientoUseCase(seguimientoRepositoryMock);
  });

  it('retorna seguimiento existente', async () => {
    const seguimiento = new Seguimiento({
      idSeguimiento: 9,
      idTarea: 3,
      fechaSeguimiento: new Date('2026-05-10T00:00:00.000Z'),
      estadoReportado: 'Registrado',
      cantidadMaterialUsado: 5,
      porcentajeAvance: 20,
      observaciones: 'Observacion',
    });

    seguimientoRepositoryMock.findById.mockResolvedValue(seguimiento);

    await expect(
      useCase.execute({
        idSeguimiento: 9,
      }),
    ).resolves.toBe(seguimiento);
  });

  it('lanza NotFoundException si no existe', async () => {
    seguimientoRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idSeguimiento: 404,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
