import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EstadoOrdenCompra, OrdenCompra, Proveedor } from '../../../../domain';
import type {
  OrdenCompraRepository,
  ProveedorRepository,
} from '../../../../infrastructure';
import { CrearOrdenCompraDto } from '../../dto';
import { CrearOrdenCompraUseCase } from '../crear-orden-compra.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('CrearOrdenCompraUseCase', () => {
  let useCase: CrearOrdenCompraUseCase;
  let ordenCompraRepositoryMock: jest.Mocked<OrdenCompraRepository>;
  let proveedorRepositoryMock: jest.Mocked<ProveedorRepository>;

  const dtoBase: CrearOrdenCompraDto = {
    idProveedor: 9,
    fechaOrden: '2026-06-01T00:00:00.000Z',
    fechaEntregaEstimada: '2026-06-10T00:00:00.000Z',
  };

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

    proveedorRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByNombreOrCorreo: jest.fn(),
      existsByNombreOrCorreoExcludingId: jest.fn(),
    };

    useCase = new CrearOrdenCompraUseCase(
      ordenCompraRepositoryMock,
      proveedorRepositoryMock,
    );
  });

  it('crea orden correctamente si proveedor existe', async () => {
    const proveedor = new Proveedor({
      idProveedor: 9,
      nombre: 'Proveedor Base',
      direccion: 'Av. 1',
      telefono: '70000001',
      correo: 'proveedor@example.com',
    });
    const ordenCreada = new OrdenCompra({
      idOrdenCompra: 18,
      idProveedor: dtoBase.idProveedor,
      fechaOrden: new Date(dtoBase.fechaOrden),
      fechaEntregaEstimada: new Date(dtoBase.fechaEntregaEstimada!),
      estadoOrden: EstadoOrdenCompra.BORRADOR,
    });

    proveedorRepositoryMock.findById.mockResolvedValue(proveedor);
    ordenCompraRepositoryMock.create.mockResolvedValue(ordenCreada);

    const result = await useCase.execute(dtoBase);

    expect(proveedorRepositoryMock.findById).toHaveBeenCalledWith(
      dtoBase.idProveedor,
    );
    expect(ordenCompraRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idProveedor: dtoBase.idProveedor,
        fechaOrden: expectAnyDate(),
        fechaEntregaEstimada: expectAnyDate(),
        estadoOrden: EstadoOrdenCompra.BORRADOR,
      }),
    );
    expect(result).toBe(ordenCreada);
  });

  it('lanza NotFoundException si proveedor no existe', async () => {
    proveedorRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(ordenCompraRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si fechaEntregaEstimada es anterior a fechaOrden', async () => {
    proveedorRepositoryMock.findById.mockResolvedValue(
      new Proveedor({
        idProveedor: 9,
        nombre: 'Proveedor Base',
        direccion: 'Av. 1',
        telefono: '70000001',
        correo: 'proveedor@example.com',
      }),
    );

    await expect(
      useCase.execute({
        ...dtoBase,
        fechaEntregaEstimada: '2026-05-01T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(ordenCompraRepositoryMock.create).not.toHaveBeenCalled();
  });
});
