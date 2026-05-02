import { NotFoundException } from '@nestjs/common';
import { EstadoOrdenCompra, OrdenCompra } from '../../../../domain';
import type { OrdenCompraRepository } from '../../../../infrastructure';
import { ActualizarEstadoOrdenCompraDto } from '../../dto';
import { ActualizarEstadoOrdenCompraUseCase } from '../actualizar-estado-orden-compra.usecase';

describe('ActualizarEstadoOrdenCompraUseCase', () => {
  let useCase: ActualizarEstadoOrdenCompraUseCase;
  let ordenCompraRepositoryMock: jest.Mocked<OrdenCompraRepository>;

  const dtoBase: ActualizarEstadoOrdenCompraDto = {
    idOrdenCompra: 6,
    estadoOrden: EstadoOrdenCompra.EMITIDA,
  };

  const ordenExistente = new OrdenCompra({
    idOrdenCompra: 6,
    idProveedor: 2,
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

    useCase = new ActualizarEstadoOrdenCompraUseCase(ordenCompraRepositoryMock);
  });

  it('actualiza estado correctamente', async () => {
    const ordenActualizada = new OrdenCompra({
      ...ordenExistente,
      estadoOrden: dtoBase.estadoOrden,
    });

    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    ordenCompraRepositoryMock.update.mockResolvedValue(ordenActualizada);

    const result = await useCase.execute(dtoBase);

    expect(ordenCompraRepositoryMock.update).toHaveBeenCalledWith(
      dtoBase.idOrdenCompra,
      {
        estadoOrden: dtoBase.estadoOrden,
      },
    );
    expect(result).toBe(ordenActualizada);
  });

  it('lanza NotFoundException si no existe', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
