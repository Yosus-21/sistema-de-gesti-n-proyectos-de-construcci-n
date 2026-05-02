import { NotFoundException } from '@nestjs/common';
import { Contrato } from '../../../../domain';
import type { ContratoRepository } from '../../../../infrastructure';
import { ConsultarContratoContratistaUseCase } from '../consultar-contrato-contratista.usecase';

describe('ConsultarContratoContratistaUseCase', () => {
  let useCase: ConsultarContratoContratistaUseCase;
  let contratoRepositoryMock: jest.Mocked<ContratoRepository>;

  beforeEach(() => {
    contratoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ConsultarContratoContratistaUseCase(contratoRepositoryMock);
  });

  it('retorna contrato existente', async () => {
    const contrato = new Contrato({
      idContrato: 31,
      idProyecto: 9,
      idContratista: 6,
      fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
      fechaFin: new Date('2026-05-06T00:00:00.000Z'),
      metodoPago: 'Transferencia',
      terminosYCondiciones: 'Base',
      estadoContrato: 'VIGENTE',
      costoTotal: 1250,
    });

    contratoRepositoryMock.findById.mockResolvedValue(contrato);

    await expect(
      useCase.execute({
        idContrato: 31,
      }),
    ).resolves.toBe(contrato);
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
