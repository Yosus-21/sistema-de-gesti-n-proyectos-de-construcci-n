import { NotFoundException } from '@nestjs/common';
import { EstadoOrdenCompra, OrdenCompra } from '../../../../domain';
import type { OrdenCompraRepository } from '../../../../infrastructure';
import { CalcularMontoTotalOrdenCompraDto } from '../../dto';
import { CalcularMontoTotalOrdenCompraUseCase } from '../calcular-monto-total-orden-compra.usecase';

describe('CalcularMontoTotalOrdenCompraUseCase', () => {
  let useCase: CalcularMontoTotalOrdenCompraUseCase;
  let ordenCompraRepositoryMock: jest.Mocked<OrdenCompraRepository>;

  const dtoBase: CalcularMontoTotalOrdenCompraDto = {
    idOrdenCompra: 13,
  };

  const ordenExistente = new OrdenCompra({
    idOrdenCompra: 13,
    idProveedor: 5,
    fechaOrden: new Date('2026-06-01T00:00:00.000Z'),
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

    useCase = new CalcularMontoTotalOrdenCompraUseCase(
      ordenCompraRepositoryMock,
    );
  });

  it('retorna montoTotal calculado', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    ordenCompraRepositoryMock.calcularMontoTotal.mockResolvedValue(248.5);

    const result = await useCase.execute(dtoBase);

    expect(ordenCompraRepositoryMock.calcularMontoTotal).toHaveBeenCalledWith(
      dtoBase.idOrdenCompra,
    );
    expect(result).toEqual({
      idOrdenCompra: dtoBase.idOrdenCompra,
      montoTotal: 248.5,
    });
  });

  it('lanza NotFoundException si la orden no existe', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
