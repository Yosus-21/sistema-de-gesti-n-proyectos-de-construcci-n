import { ConflictException, NotFoundException } from '@nestjs/common';
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
import { ConfirmarRecepcionMaterialDto } from '../../dto';
import { ConfirmarRecepcionMaterialUseCase } from '../confirmar-recepcion-material.usecase';

describe('ConfirmarRecepcionMaterialUseCase', () => {
  let useCase: ConfirmarRecepcionMaterialUseCase;
  let entregaMaterialRepositoryMock: jest.Mocked<EntregaMaterialRepository>;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;
  let ordenCompraRepositoryMock: jest.Mocked<OrdenCompraRepository>;

  const dtoBase: ConfirmarRecepcionMaterialDto = {
    idEntregaMaterial: 14,
  };

  const entregaRegistrada = new EntregaMaterial({
    idEntregaMaterial: 14,
    idOrdenCompra: 4,
    idMaterial: 8,
    fechaEntrega: new Date('2026-06-15T00:00:00.000Z'),
    estadoEntrega: 'REGISTRADA',
    cantidadEntregada: 5,
  });

  const materialExistente = new Material({
    idMaterial: 8,
    nombre: 'Arena',
    descripcion: 'Material base',
    tipoMaterial: TipoMaterial.GENERAL,
    unidad: 'm3',
    cantidadDisponible: 10,
    costoUnitario: 30,
  });
  const ordenEmitida = new OrdenCompra({
    idOrdenCompra: 4,
    idProveedor: 2,
    fechaOrden: new Date('2026-06-10T00:00:00.000Z'),
    estadoOrden: EstadoOrdenCompra.EMITIDA,
  });
  const lineaOrden = new LineaOrdenCompra({
    idLineaOrdenCompra: 1,
    idOrdenCompra: 4,
    idMaterial: 8,
    cantidadSolicitada: 5,
    precioUnitarioAcordado: 30,
  });

  beforeEach(() => {
    entregaMaterialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

    ordenCompraRepositoryMock.findById.mockResolvedValue(ordenEmitida);
    ordenCompraRepositoryMock.findLineasByOrden.mockResolvedValue([lineaOrden]);
    entregaMaterialRepositoryMock.findMany.mockResolvedValue([
      new EntregaMaterial({
        ...entregaRegistrada,
        estadoEntrega: 'RECIBIDA',
      }),
    ]);

    useCase = new ConfirmarRecepcionMaterialUseCase(
      entregaMaterialRepositoryMock,
      materialRepositoryMock,
      ordenCompraRepositoryMock,
    );
  });

  it('confirma recepción, cambia estado a RECIBIDA y aumenta stock del material', async () => {
    const entregaActualizada = new EntregaMaterial({
      ...entregaRegistrada,
      estadoEntrega: 'RECIBIDA',
    });

    entregaMaterialRepositoryMock.findById.mockResolvedValue(entregaRegistrada);
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    materialRepositoryMock.update.mockResolvedValue(
      new Material({
        ...materialExistente,
        cantidadDisponible: 15,
      }),
    );
    entregaMaterialRepositoryMock.update.mockResolvedValue(entregaActualizada);

    const result = await useCase.execute(dtoBase);

    expect(materialRepositoryMock.update).toHaveBeenCalledWith(
      entregaRegistrada.idMaterial!,
      {
        cantidadDisponible:
          materialExistente.cantidadDisponible +
          entregaRegistrada.cantidadEntregada,
      },
    );
    expect(entregaMaterialRepositoryMock.update).toHaveBeenCalledWith(
      dtoBase.idEntregaMaterial,
      {
        estadoEntrega: 'RECIBIDA',
      },
    );
    expect(result).toBe(entregaActualizada);
  });

  it('actualiza la orden a RECIBIDA si todas las lineas quedan completas', async () => {
    const entregaActualizada = new EntregaMaterial({
      ...entregaRegistrada,
      estadoEntrega: 'RECIBIDA',
    });

    entregaMaterialRepositoryMock.findById.mockResolvedValue(entregaRegistrada);
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    materialRepositoryMock.update.mockResolvedValue(materialExistente);
    entregaMaterialRepositoryMock.update.mockResolvedValue(entregaActualizada);

    await useCase.execute(dtoBase);

    expect(ordenCompraRepositoryMock.update).toHaveBeenCalledWith(4, {
      estadoOrden: EstadoOrdenCompra.RECIBIDA,
    });
  });

  it('mantiene estado actual si la orden queda parcial y no existe estado parcial', async () => {
    const entregaActualizada = new EntregaMaterial({
      ...entregaRegistrada,
      estadoEntrega: 'RECIBIDA',
    });

    entregaMaterialRepositoryMock.findById.mockResolvedValue(entregaRegistrada);
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    materialRepositoryMock.update.mockResolvedValue(materialExistente);
    entregaMaterialRepositoryMock.update.mockResolvedValue(entregaActualizada);
    ordenCompraRepositoryMock.findLineasByOrden.mockResolvedValue([
      lineaOrden,
      new LineaOrdenCompra({
        idLineaOrdenCompra: 2,
        idOrdenCompra: 4,
        idMaterial: 9,
        cantidadSolicitada: 3,
        precioUnitarioAcordado: 12,
      }),
    ]);
    entregaMaterialRepositoryMock.findMany.mockResolvedValue([
      entregaActualizada,
    ]);

    await useCase.execute(dtoBase);

    expect(ordenCompraRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('no cuenta entregas REGISTRADA para completar la orden', async () => {
    const entregaActualizada = new EntregaMaterial({
      ...entregaRegistrada,
      estadoEntrega: 'RECIBIDA',
      cantidadEntregada: 2,
    });

    entregaMaterialRepositoryMock.findById.mockResolvedValue(
      new EntregaMaterial({
        ...entregaRegistrada,
        cantidadEntregada: 2,
      }),
    );
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    materialRepositoryMock.update.mockResolvedValue(materialExistente);
    entregaMaterialRepositoryMock.update.mockResolvedValue(entregaActualizada);
    entregaMaterialRepositoryMock.findMany.mockResolvedValue([
      entregaActualizada,
    ]);

    await useCase.execute(dtoBase);

    expect(entregaMaterialRepositoryMock.findMany).toHaveBeenCalledWith({
      idOrdenCompra: 4,
      estadoEntrega: 'RECIBIDA',
    });
    expect(ordenCompraRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('maneja orden sin lineas sin actualizar estado', async () => {
    const entregaActualizada = new EntregaMaterial({
      ...entregaRegistrada,
      estadoEntrega: 'RECIBIDA',
    });

    entregaMaterialRepositoryMock.findById.mockResolvedValue(entregaRegistrada);
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    materialRepositoryMock.update.mockResolvedValue(materialExistente);
    entregaMaterialRepositoryMock.update.mockResolvedValue(entregaActualizada);
    ordenCompraRepositoryMock.findLineasByOrden.mockResolvedValue([]);

    await useCase.execute(dtoBase);

    expect(ordenCompraRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('lanza NotFoundException si entrega no existe', async () => {
    entregaMaterialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza NotFoundException si material no existe', async () => {
    entregaMaterialRepositoryMock.findById.mockResolvedValue(entregaRegistrada);
    materialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza ConflictException si la entrega ya está RECIBIDA', async () => {
    entregaMaterialRepositoryMock.findById.mockResolvedValue(
      new EntregaMaterial({
        ...entregaRegistrada,
        estadoEntrega: 'RECIBIDA',
      }),
    );
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(materialRepositoryMock.update).not.toHaveBeenCalled();
    expect(ordenCompraRepositoryMock.update).not.toHaveBeenCalled();
  });
});
