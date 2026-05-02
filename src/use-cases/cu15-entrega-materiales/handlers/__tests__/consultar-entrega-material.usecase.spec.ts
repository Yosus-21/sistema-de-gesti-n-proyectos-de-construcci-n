import { NotFoundException } from '@nestjs/common';
import { EntregaMaterial } from '../../../../domain';
import type { EntregaMaterialRepository } from '../../../../infrastructure';
import { ConsultarEntregaMaterialDto } from '../../dto';
import { ConsultarEntregaMaterialUseCase } from '../consultar-entrega-material.usecase';

describe('ConsultarEntregaMaterialUseCase', () => {
  let useCase: ConsultarEntregaMaterialUseCase;
  let entregaMaterialRepositoryMock: jest.Mocked<EntregaMaterialRepository>;

  const dtoBase: ConsultarEntregaMaterialDto = {
    idEntregaMaterial: 6,
  };

  const entregaExistente = new EntregaMaterial({
    idEntregaMaterial: 6,
    idOrdenCompra: 2,
    idMaterial: 7,
    fechaEntrega: new Date('2026-06-15T00:00:00.000Z'),
    estadoEntrega: 'REGISTRADA',
    cantidadEntregada: 3,
  });

  beforeEach(() => {
    entregaMaterialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ConsultarEntregaMaterialUseCase(
      entregaMaterialRepositoryMock,
    );
  });

  it('retorna entrega existente', async () => {
    entregaMaterialRepositoryMock.findById.mockResolvedValue(entregaExistente);

    const result = await useCase.execute(dtoBase);

    expect(result).toBe(entregaExistente);
  });

  it('lanza NotFoundException si no existe', async () => {
    entregaMaterialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
