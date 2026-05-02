import { ConflictException, NotFoundException } from '@nestjs/common';
import { EntregaMaterial, Material, TipoMaterial } from '../../../../domain';
import type {
  EntregaMaterialRepository,
  MaterialRepository,
} from '../../../../infrastructure';
import { ConfirmarRecepcionMaterialDto } from '../../dto';
import { ConfirmarRecepcionMaterialUseCase } from '../confirmar-recepcion-material.usecase';

describe('ConfirmarRecepcionMaterialUseCase', () => {
  let useCase: ConfirmarRecepcionMaterialUseCase;
  let entregaMaterialRepositoryMock: jest.Mocked<EntregaMaterialRepository>;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

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

    useCase = new ConfirmarRecepcionMaterialUseCase(
      entregaMaterialRepositoryMock,
      materialRepositoryMock,
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
  });
});
