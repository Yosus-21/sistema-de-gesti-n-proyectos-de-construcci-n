import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EntregaMaterial,
  EstadoOrdenCompra,
  LineaOrdenCompra,
  Material,
  OrdenCompra,
  TipoMaterial,
} from '../../../../domain';
import type {
  EntregaMaterialRepository,
  MaterialRepository,
  OrdenCompraRepository,
} from '../../../../infrastructure';
import { RegistrarEntregaMaterialDto } from '../../dto';
import { RegistrarEntregaMaterialUseCase } from '../registrar-entrega-material.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('RegistrarEntregaMaterialUseCase', () => {
  let useCase: RegistrarEntregaMaterialUseCase;
  let entregaMaterialRepositoryMock: jest.Mocked<EntregaMaterialRepository>;
  let ordenCompraRepositoryMock: jest.Mocked<OrdenCompraRepository>;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const dtoBase: RegistrarEntregaMaterialDto = {
    idOrdenCompra: 5,
    idMaterial: 8,
    fechaEntrega: '2026-06-15T00:00:00.000Z',
    cantidadEntregada: 4,
    observaciones: 'Entrega parcial',
  };

  const ordenExistente = new OrdenCompra({
    idOrdenCompra: 5,
    idProveedor: 2,
    fechaOrden: new Date('2026-06-10T00:00:00.000Z'),
    fechaEntregaEstimada: new Date('2026-06-20T00:00:00.000Z'),
    estadoOrden: EstadoOrdenCompra.EMITIDA,
  });

  const materialExistente = new Material({
    idMaterial: 8,
    nombre: 'Cemento',
    descripcion: 'Material base',
    tipoMaterial: TipoMaterial.GENERAL,
    unidad: 'bolsa',
    cantidadDisponible: 10,
    costoUnitario: 25,
  });

  const lineaExistente = new LineaOrdenCompra({
    idLineaOrdenCompra: 12,
    idOrdenCompra: 5,
    idMaterial: 8,
    cantidadSolicitada: 6,
    precioUnitarioAcordado: 20,
    estadoLinea: 'PENDIENTE',
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

    materialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByNombre: jest.fn(),
      existsByNombreExcludingId: jest.fn(),
    };

    useCase = new RegistrarEntregaMaterialUseCase(
      entregaMaterialRepositoryMock,
      ordenCompraRepositoryMock,
      materialRepositoryMock,
    );
  });

  it('registra entrega correctamente si orden y material existen y el material está en la orden', async () => {
    const entregaCreada = new EntregaMaterial({
      idEntregaMaterial: 20,
      idOrdenCompra: dtoBase.idOrdenCompra,
      idMaterial: dtoBase.idMaterial,
      fechaEntrega: new Date(dtoBase.fechaEntrega),
      cantidadEntregada: dtoBase.cantidadEntregada,
      estadoEntrega: 'REGISTRADA',
      observaciones: dtoBase.observaciones,
    });

    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    ordenCompraRepositoryMock.findLineasByOrden.mockResolvedValue([
      lineaExistente,
    ]);
    entregaMaterialRepositoryMock.create.mockResolvedValue(entregaCreada);

    const result = await useCase.execute(dtoBase);

    expect(entregaMaterialRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idOrdenCompra: dtoBase.idOrdenCompra,
        idMaterial: dtoBase.idMaterial,
        fechaEntrega: expectAnyDate(),
        cantidadEntregada: dtoBase.cantidadEntregada,
        estadoEntrega: 'REGISTRADA',
      }),
    );
    expect(result).toBe(entregaCreada);
  });

  it('lanza NotFoundException si orden no existe', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza NotFoundException si material no existe', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    materialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza BadRequestException si material no pertenece a la orden', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    ordenCompraRepositoryMock.findLineasByOrden.mockResolvedValue([]);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('lanza BadRequestException si cantidadEntregada <= 0', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);

    await expect(
      useCase.execute({
        ...dtoBase,
        cantidadEntregada: 0,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lanza BadRequestException si cantidadEntregada supera cantidadSolicitada', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    ordenCompraRepositoryMock.findLineasByOrden.mockResolvedValue([
      lineaExistente,
    ]);

    await expect(
      useCase.execute({
        ...dtoBase,
        cantidadEntregada: 10,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
