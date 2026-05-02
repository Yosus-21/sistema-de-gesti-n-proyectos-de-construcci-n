import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EstadoOrdenCompra,
  LineaOrdenCompra,
  Material,
  OrdenCompra,
  TipoMaterial,
} from '../../../../domain';
import type {
  MaterialRepository,
  OrdenCompraRepository,
} from '../../../../infrastructure';
import { AgregarLineaOrdenCompraDto } from '../../dto';
import { AgregarLineaOrdenCompraUseCase } from '../agregar-linea-orden-compra.usecase';

describe('AgregarLineaOrdenCompraUseCase', () => {
  let useCase: AgregarLineaOrdenCompraUseCase;
  let ordenCompraRepositoryMock: jest.Mocked<OrdenCompraRepository>;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const dtoBase: AgregarLineaOrdenCompraDto = {
    idOrdenCompra: 5,
    idMaterial: 12,
    cantidadSolicitada: 8,
    precioUnitarioAcordado: 15.5,
  };

  const ordenExistente = new OrdenCompra({
    idOrdenCompra: 5,
    idProveedor: 3,
    fechaOrden: new Date('2026-06-01T00:00:00.000Z'),
    fechaEntregaEstimada: new Date('2026-06-10T00:00:00.000Z'),
    estadoOrden: EstadoOrdenCompra.BORRADOR,
  });

  const materialExistente = new Material({
    idMaterial: 12,
    nombre: 'Cemento',
    descripcion: 'Material base',
    tipoMaterial: TipoMaterial.OBRA_BRUTA,
    unidad: 'bolsa',
    cantidadDisponible: 50,
    costoUnitario: 20,
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

    materialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByNombre: jest.fn(),
      existsByNombreExcludingId: jest.fn(),
    };

    useCase = new AgregarLineaOrdenCompraUseCase(
      ordenCompraRepositoryMock,
      materialRepositoryMock,
    );
  });

  it('agrega línea correctamente si orden y material existen', async () => {
    const lineaCreada = new LineaOrdenCompra({
      idLineaOrdenCompra: 21,
      ...dtoBase,
      estadoLinea: 'PENDIENTE',
    });

    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    ordenCompraRepositoryMock.addLinea.mockResolvedValue(lineaCreada);

    const result = await useCase.execute(dtoBase);

    expect(ordenCompraRepositoryMock.addLinea).toHaveBeenCalledWith(
      expect.objectContaining({
        idOrdenCompra: dtoBase.idOrdenCompra,
        idMaterial: dtoBase.idMaterial,
        cantidadSolicitada: dtoBase.cantidadSolicitada,
        precioUnitarioAcordado: dtoBase.precioUnitarioAcordado,
        estadoLinea: 'PENDIENTE',
      }),
    );
    expect(result).toBe(lineaCreada);
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

  it('lanza BadRequestException si cantidadSolicitada <= 0', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);

    await expect(
      useCase.execute({
        ...dtoBase,
        cantidadSolicitada: 0,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lanza BadRequestException si precioUnitarioAcordado < 0', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);

    await expect(
      useCase.execute({
        ...dtoBase,
        precioUnitarioAcordado: -1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
