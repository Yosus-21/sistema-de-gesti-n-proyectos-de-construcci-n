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
import { AjustarAsignacionMaterialDto } from '../../dto';
import { AjustarAsignacionMaterialUseCase } from '../ajustar-asignacion-material.usecase';

describe('AjustarAsignacionMaterialUseCase', () => {
  let useCase: AjustarAsignacionMaterialUseCase;
  let asignacionMaterialRepositoryMock: jest.Mocked<AsignacionMaterialRepository>;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const dtoBase: AjustarAsignacionMaterialDto = {
    idAsignacionMaterial: 15,
    cantidadAsignada: 4,
    costoMaximoPermitido: 18,
    restricciones: 'Ajuste previo',
  };

  const asignacionPendiente = new AsignacionMaterial({
    idAsignacionMaterial: 15,
    idMaterial: 9,
    cantidadAsignada: 1,
    fechaAsignacion: new Date('2026-07-06T00:00:00.000Z'),
    costoMaximoPermitido: 20,
    restricciones: 'Inicial',
    estadoAsignacion: EstadoAsignacion.PENDIENTE,
    generadaPorIa: true,
  });

  const materialExistente = new Material({
    idMaterial: 9,
    nombre: 'Arena',
    descripcion: 'Material disponible',
    tipoMaterial: TipoMaterial.GENERAL,
    unidad: 'm3',
    cantidadDisponible: 10,
    costoUnitario: 8,
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

    useCase = new AjustarAsignacionMaterialUseCase(
      asignacionMaterialRepositoryMock,
      materialRepositoryMock,
    );
  });

  it('ajusta cantidad/restricciones correctamente', async () => {
    const asignacionActualizada = new AsignacionMaterial({
      ...asignacionPendiente,
      cantidadAsignada: dtoBase.cantidadAsignada,
      costoMaximoPermitido: dtoBase.costoMaximoPermitido,
      restricciones: dtoBase.restricciones,
    });

    asignacionMaterialRepositoryMock.findById.mockResolvedValue(
      asignacionPendiente,
    );
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    asignacionMaterialRepositoryMock.update.mockResolvedValue(
      asignacionActualizada,
    );

    const result = await useCase.execute(dtoBase);

    expect(asignacionMaterialRepositoryMock.update).toHaveBeenCalledWith(
      dtoBase.idAsignacionMaterial,
      {
        cantidadAsignada: dtoBase.cantidadAsignada,
        costoMaximoPermitido: dtoBase.costoMaximoPermitido,
        restricciones: dtoBase.restricciones,
      },
    );
    expect(result).toBe(asignacionActualizada);
  });

  it('lanza NotFoundException si asignación no existe', async () => {
    asignacionMaterialRepositoryMock.findById.mockResolvedValue(null);

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

  it('lanza BadRequestException si cantidadAsignada <= 0', async () => {
    asignacionMaterialRepositoryMock.findById.mockResolvedValue(
      asignacionPendiente,
    );

    await expect(
      useCase.execute({
        ...dtoBase,
        cantidadAsignada: 0,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
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
