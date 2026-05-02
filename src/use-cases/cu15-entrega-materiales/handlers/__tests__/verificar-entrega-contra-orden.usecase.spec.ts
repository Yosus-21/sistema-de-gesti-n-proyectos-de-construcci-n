import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EntregaMaterial,
  EstadoOrdenCompra,
  LineaOrdenCompra,
  OrdenCompra,
} from '../../../../domain';
import type {
  EntregaMaterialRepository,
  OrdenCompraRepository,
} from '../../../../infrastructure';
import { VerificarEntregaContraOrdenDto } from '../../dto';
import { VerificarEntregaContraOrdenUseCase } from '../verificar-entrega-contra-orden.usecase';

describe('VerificarEntregaContraOrdenUseCase', () => {
  let useCase: VerificarEntregaContraOrdenUseCase;
  let entregaMaterialRepositoryMock: jest.Mocked<EntregaMaterialRepository>;
  let ordenCompraRepositoryMock: jest.Mocked<OrdenCompraRepository>;

  const dtoBase: VerificarEntregaContraOrdenDto = {
    idEntregaMaterial: 10,
    idOrdenCompra: 4,
  };

  const entregaExistente = new EntregaMaterial({
    idEntregaMaterial: 10,
    idOrdenCompra: 4,
    idMaterial: 9,
    fechaEntrega: new Date('2026-06-15T00:00:00.000Z'),
    estadoEntrega: 'REGISTRADA',
    cantidadEntregada: 4,
  });

  const ordenExistente = new OrdenCompra({
    idOrdenCompra: 4,
    idProveedor: 2,
    fechaOrden: new Date('2026-06-10T00:00:00.000Z'),
    estadoOrden: EstadoOrdenCompra.EMITIDA,
  });

  beforeEach(() => {
    entregaMaterialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

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

    useCase = new VerificarEntregaContraOrdenUseCase(
      entregaMaterialRepositoryMock,
      ordenCompraRepositoryMock,
    );
  });

  it('retorna coincide true si material y cantidad coinciden con la orden', async () => {
    entregaMaterialRepositoryMock.findById.mockResolvedValue(entregaExistente);
    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    ordenCompraRepositoryMock.findLineasByOrden.mockResolvedValue([
      new LineaOrdenCompra({
        idLineaOrdenCompra: 3,
        idOrdenCompra: 4,
        idMaterial: 9,
        cantidadSolicitada: 6,
        precioUnitarioAcordado: 10,
      }),
    ]);

    const result = await useCase.execute(dtoBase);

    expect(result).toEqual({
      idEntregaMaterial: dtoBase.idEntregaMaterial,
      idOrdenCompra: dtoBase.idOrdenCompra,
      coincide: true,
      cantidadEntregada: entregaExistente.cantidadEntregada,
      cantidadSolicitada: 6,
      mensaje: 'La entrega coincide con la orden de compra.',
    });
  });

  it('retorna coincide false si el material no pertenece a la orden', async () => {
    entregaMaterialRepositoryMock.findById.mockResolvedValue(entregaExistente);
    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    ordenCompraRepositoryMock.findLineasByOrden.mockResolvedValue([]);

    const result = await useCase.execute(dtoBase);

    expect(result).toEqual({
      idEntregaMaterial: dtoBase.idEntregaMaterial,
      idOrdenCompra: dtoBase.idOrdenCompra,
      coincide: false,
      mensaje: 'El material entregado no pertenece a la orden de compra.',
    });
  });

  it('lanza NotFoundException si entrega no existe', async () => {
    entregaMaterialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza NotFoundException si orden no existe', async () => {
    entregaMaterialRepositoryMock.findById.mockResolvedValue(entregaExistente);
    ordenCompraRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza BadRequestException si la entrega no pertenece a la orden indicada', async () => {
    entregaMaterialRepositoryMock.findById.mockResolvedValue(
      new EntregaMaterial({
        ...entregaExistente,
        idOrdenCompra: 99,
      }),
    );
    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
