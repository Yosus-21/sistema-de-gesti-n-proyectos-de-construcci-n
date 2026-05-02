import { NotFoundException } from '@nestjs/common';
import { EstadoOrdenCompra, OrdenCompra } from '../../../../domain';
import type { OrdenCompraRepository } from '../../../../infrastructure';
import { ConsultarOrdenCompraDto } from '../../dto';
import { ConsultarOrdenCompraUseCase } from '../consultar-orden-compra.usecase';

describe('ConsultarOrdenCompraUseCase', () => {
  let useCase: ConsultarOrdenCompraUseCase;
  let ordenCompraRepositoryMock: jest.Mocked<OrdenCompraRepository>;

  const dtoBase: ConsultarOrdenCompraDto = {
    idOrdenCompra: 7,
  };

  const ordenExistente = new OrdenCompra({
    idOrdenCompra: 7,
    idProveedor: 4,
    fechaOrden: new Date('2026-06-01T00:00:00.000Z'),
    fechaEntregaEstimada: new Date('2026-06-05T00:00:00.000Z'),
    estadoOrden: EstadoOrdenCompra.BORRADOR,
  });

  beforeEach(() => {
    ordenCompraRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addLinea: jest.fn(),
      findLineasByOrden: jest.fn(),
      calcularMontoTotal: jest.fn(),
    };

    useCase = new ConsultarOrdenCompraUseCase(ordenCompraRepositoryMock);
  });

  it('retorna orden existente', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);

    const result = await useCase.execute(dtoBase);

    expect(result).toBe(ordenExistente);
  });

  it('lanza NotFoundException si no existe', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
