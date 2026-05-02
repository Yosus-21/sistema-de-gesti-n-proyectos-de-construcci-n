import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Contrato } from '../../../../domain';
import type { ContratoRepository } from '../../../../infrastructure';
import { ModificarContratoContratistaUseCase } from '../modificar-contrato-contratista.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('ModificarContratoContratistaUseCase', () => {
  let useCase: ModificarContratoContratistaUseCase;
  let contratoRepositoryMock: jest.Mocked<ContratoRepository>;

  const contratoBase = new Contrato({
    idContrato: 12,
    idProyecto: 5,
    idContratista: 8,
    fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
    fechaFin: new Date('2026-05-06T00:00:00.000Z'),
    metodoPago: 'Transferencia',
    terminosYCondiciones: 'Base',
    estadoContrato: 'VIGENTE',
    costoTotal: 1250,
  });

  beforeEach(() => {
    contratoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ModificarContratoContratistaUseCase(contratoRepositoryMock);
  });

  it('modifica contrato existente', async () => {
    contratoRepositoryMock.findById.mockResolvedValue(contratoBase);
    contratoRepositoryMock.update.mockResolvedValue(
      new Contrato({
        ...contratoBase,
        metodoPago: 'Cheque',
        fechaFin: new Date('2026-05-08T00:00:00.000Z'),
      }),
    );

    const result = await useCase.execute({
      idContrato: 12,
      metodoPago: 'Cheque',
      fechaFin: '2026-05-08T00:00:00.000Z',
    });

    expect(contratoRepositoryMock.update).toHaveBeenCalledWith(
      12,
      expect.objectContaining({
        metodoPago: 'Cheque',
        fechaFin: expectAnyDate(),
      }),
    );
    expect(result.idContrato).toBe(12);
  });

  it('lanza NotFoundException si no existe', async () => {
    contratoRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idContrato: 404,
        metodoPago: 'No importa',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza BadRequestException si fechas quedan inconsistentes', async () => {
    contratoRepositoryMock.findById.mockResolvedValue(contratoBase);

    await expect(
      useCase.execute({
        idContrato: 12,
        fechaInicio: '2026-05-10T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
