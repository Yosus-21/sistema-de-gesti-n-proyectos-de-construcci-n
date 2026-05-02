import { NotFoundException } from '@nestjs/common';
import { Contrato } from '../../../../domain';
import type { ContratoRepository } from '../../../../infrastructure';
import { CalcularCostoContratoUseCase } from '../calcular-costo-contrato.usecase';

describe('CalcularCostoContratoUseCase', () => {
  let useCase: CalcularCostoContratoUseCase;
  let contratoRepositoryMock: jest.Mocked<ContratoRepository>;

  beforeEach(() => {
    contratoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CalcularCostoContratoUseCase(contratoRepositoryMock);
  });

  it('retorna costoTotal del contrato', async () => {
    contratoRepositoryMock.findById.mockResolvedValue(
      new Contrato({
        idContrato: 18,
        idProyecto: 5,
        idContratista: 6,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFin: new Date('2026-05-06T00:00:00.000Z'),
        metodoPago: 'Transferencia',
        terminosYCondiciones: 'Base',
        estadoContrato: 'VIGENTE',
        costoTotal: 1250,
      }),
    );

    await expect(
      useCase.execute({
        idContrato: 18,
      }),
    ).resolves.toEqual({
      idContrato: 18,
      costoTotal: 1250,
    });
  });

  it('lanza NotFoundException si no existe', async () => {
    contratoRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idContrato: 404,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
