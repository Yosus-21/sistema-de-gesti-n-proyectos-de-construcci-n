import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  AsignacionMaterial,
  EstadoAsignacion,
  Material,
  TipoMaterial,
} from '../../../../domain';
import type {
  AsignacionMaterialRepository,
  MaterialRepository,
} from '../../../../infrastructure';
import { ConfirmarAsignacionMaterialDto } from '../../dto';
import { ConfirmarAsignacionMaterialUseCase } from '../confirmar-asignacion-material.usecase';

describe('ConfirmarAsignacionMaterialUseCase', () => {
  let useCase: ConfirmarAsignacionMaterialUseCase;
  let asignacionMaterialRepositoryMock: jest.Mocked<AsignacionMaterialRepository>;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const dtoBase: ConfirmarAsignacionMaterialDto = {
    idAsignacionMaterial: 11,
  };

  const asignacionPendiente = new AsignacionMaterial({
    idAsignacionMaterial: 11,
    idMaterial: 6,
    cantidadAsignada: 3,
    fechaAsignacion: new Date('2026-07-05T00:00:00.000Z'),
    estadoAsignacion: EstadoAsignacion.PENDIENTE,
    generadaPorIa: true,
  });

  const materialExistente = new Material({
    idMaterial: 6,
    nombre: 'Ladrillo',
    descripcion: 'Material disponible',
    tipoMaterial: TipoMaterial.OBRA_BRUTA,
    unidad: 'pieza',
    cantidadDisponible: 10,
    costoUnitario: 2,
  });

  beforeEach(() => {
    asignacionMaterialRepositoryMock = {
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

    useCase = new ConfirmarAsignacionMaterialUseCase(
      asignacionMaterialRepositoryMock,
      materialRepositoryMock,
    );
  });

  it('confirma asignación y descuenta stock', async () => {
    const asignacionConfirmada = new AsignacionMaterial({
      ...asignacionPendiente,
      estadoAsignacion: EstadoAsignacion.CONFIRMADA,
    });

    asignacionMaterialRepositoryMock.findById.mockResolvedValue(
      asignacionPendiente,
    );
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    materialRepositoryMock.update.mockResolvedValue(
      new Material({
        ...materialExistente,
        cantidadDisponible: 7,
      }),
    );
    asignacionMaterialRepositoryMock.update.mockResolvedValue(
      asignacionConfirmada,
    );

    const result = await useCase.execute(dtoBase);

    expect(materialRepositoryMock.update).toHaveBeenCalledWith(
      materialExistente.idMaterial!,
      {
        cantidadDisponible: 7,
      },
    );
    expect(asignacionMaterialRepositoryMock.update).toHaveBeenCalledWith(
      dtoBase.idAsignacionMaterial,
      {
        estadoAsignacion: EstadoAsignacion.CONFIRMADA,
      },
    );
    expect(result).toBe(asignacionConfirmada);
  });

  it('lanza NotFoundException si asignación no existe', async () => {
    asignacionMaterialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza NotFoundException si material no existe', async () => {
    asignacionMaterialRepositoryMock.findById.mockResolvedValue(
      asignacionPendiente,
    );
    materialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza ConflictException si asignación ya está confirmada', async () => {
    asignacionMaterialRepositoryMock.findById.mockResolvedValue(
      new AsignacionMaterial({
        ...asignacionPendiente,
        estadoAsignacion: EstadoAsignacion.CONFIRMADA,
      }),
    );

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('lanza BadRequestException si stock insuficiente', async () => {
    asignacionMaterialRepositoryMock.findById.mockResolvedValue(
      asignacionPendiente,
    );
    materialRepositoryMock.findById.mockResolvedValue(
      new Material({
        ...materialExistente,
        cantidadDisponible: 2,
      }),
    );

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
