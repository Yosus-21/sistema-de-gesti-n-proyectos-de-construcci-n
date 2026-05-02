import { NotFoundException } from '@nestjs/common';
import { Contrato } from '../../../../domain';
import type { ContratoRepository } from '../../../../infrastructure';
import { ValidarVigenciaContratoUseCase } from '../validar-vigencia-contrato.usecase';

describe('ValidarVigenciaContratoUseCase', () => {
  let useCase: ValidarVigenciaContratoUseCase;
  let contratoRepositoryMock: jest.Mocked<ContratoRepository>;

  const contratoBase = new Contrato({
    idContrato: 18,
    idProyecto: 5,
    idContratista: 6,
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

    useCase = new ValidarVigenciaContratoUseCase(contratoRepositoryMock);
  });

  it('retorna vigente true si fechaReferencia cae entre fechaInicio y fechaFin', async () => {
    contratoRepositoryMock.findById.mockResolvedValue(contratoBase);

    const result = await useCase.execute({
      idContrato: 18,
      fechaReferencia: '2026-05-03T00:00:00.000Z',
    });

    expect(result.idContrato).toBe(18);
    expect(result.vigente).toBe(true);
    expect(result.fechaReferencia).toBe('2026-05-03T00:00:00.000Z');
  });

  it('retorna vigente false si cae fuera del rango', async () => {
    contratoRepositoryMock.findById.mockResolvedValue(contratoBase);

    const result = await useCase.execute({
      idContrato: 18,
      fechaReferencia: '2026-06-01T00:00:00.000Z',
    });

    expect(result.idContrato).toBe(18);
    expect(result.vigente).toBe(false);
    expect(result.fechaReferencia).toBe('2026-06-01T00:00:00.000Z');
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
