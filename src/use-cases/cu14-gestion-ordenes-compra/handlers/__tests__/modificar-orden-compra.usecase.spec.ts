import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EstadoOrdenCompra, OrdenCompra, Proveedor } from '../../../../domain';
import type {
  OrdenCompraRepository,
  ProveedorRepository,
} from '../../../../infrastructure';
import { ModificarOrdenCompraDto } from '../../dto';
import { ModificarOrdenCompraUseCase } from '../modificar-orden-compra.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('ModificarOrdenCompraUseCase', () => {
  let useCase: ModificarOrdenCompraUseCase;
  let ordenCompraRepositoryMock: jest.Mocked<OrdenCompraRepository>;
  let proveedorRepositoryMock: jest.Mocked<ProveedorRepository>;

  const ordenExistente = new OrdenCompra({
    idOrdenCompra: 4,
    idProveedor: 2,
    fechaOrden: new Date('2026-06-01T00:00:00.000Z'),
    fechaEntregaEstimada: new Date('2026-06-10T00:00:00.000Z'),
    estadoOrden: EstadoOrdenCompra.BORRADOR,
  });

  const dtoBase: ModificarOrdenCompraDto = {
    idOrdenCompra: 4,
    idProveedor: 3,
    fechaOrden: '2026-06-02T00:00:00.000Z',
    fechaEntregaEstimada: '2026-06-12T00:00:00.000Z',
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

    useCase = new ModificarOrdenCompraUseCase(
      ordenCompraRepositoryMock,
      proveedorRepositoryMock,
    );
  });

  it('modifica orden existente', async () => {
    const ordenActualizada = new OrdenCompra({
      ...ordenExistente,
      idProveedor: dtoBase.idProveedor,
      fechaOrden: new Date(dtoBase.fechaOrden!),
      fechaEntregaEstimada: new Date(dtoBase.fechaEntregaEstimada!),
    });

    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    proveedorRepositoryMock.findById.mockResolvedValue(
      new Proveedor({
        idProveedor: 3,
        nombre: 'Proveedor Nuevo',
        direccion: 'Av. 3',
        telefono: '70000003',
        correo: 'nuevo@example.com',
      }),
    );
    ordenCompraRepositoryMock.update.mockResolvedValue(ordenActualizada);

    const result = await useCase.execute(dtoBase);

    expect(ordenCompraRepositoryMock.update).toHaveBeenCalledWith(
      dtoBase.idOrdenCompra,
      expect.objectContaining({
        idProveedor: dtoBase.idProveedor,
        fechaOrden: expectAnyDate(),
        fechaEntregaEstimada: expectAnyDate(),
      }),
    );
    expect(result).toBe(ordenActualizada);
  });

  it('lanza NotFoundException si no existe', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza NotFoundException si nuevo proveedor no existe', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);
    proveedorRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza BadRequestException si fechas quedan inconsistentes', async () => {
    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenExistente);

    await expect(
      useCase.execute({
        idOrdenCompra: ordenExistente.idOrdenCompra!,
        fechaEntregaEstimada: '2026-05-01T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
