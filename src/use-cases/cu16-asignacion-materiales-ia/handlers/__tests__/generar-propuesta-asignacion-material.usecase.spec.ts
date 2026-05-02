import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  AsignacionMaterial,
  EstadoAsignacion,
  EstadoProyecto,
  EstadoTarea,
  Material,
  OcupacionTrabajador,
  PrioridadTarea,
  Proyecto,
  Tarea,
  TipoMaterial,
  TipoTarea,
} from '../../../../domain';
import type {
  AsignacionMaterialRepository,
  MaterialRepository,
  ProyectoRepository,
  TareaRepository,
} from '../../../../infrastructure';
import { GenerarPropuestaAsignacionMaterialDto } from '../../dto';
import { GenerarPropuestaAsignacionMaterialUseCase } from '../generar-propuesta-asignacion-material.usecase';

describe('GenerarPropuestaAsignacionMaterialUseCase', () => {
  let useCase: GenerarPropuestaAsignacionMaterialUseCase;
  let asignacionMaterialRepositoryMock: jest.Mocked<AsignacionMaterialRepository>;
  let proyectoRepositoryMock: jest.Mocked<ProyectoRepository>;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const dtoBase: GenerarPropuestaAsignacionMaterialDto = {
    idProyecto: 4,
    idTarea: 8,
    criteriosPrioridad: 'priorizar stock',
    costoMaximoPermitido: 20,
    restricciones: 'sin desperdicio',
  };

  const proyectoExistente = new Proyecto({
    idProyecto: 4,
    nombre: 'Proyecto CU16',
    descripcion: 'Proyecto de prueba',
    ubicacion: 'La Paz',
    presupuesto: 100000,
    fechaInicio: new Date('2026-07-01T00:00:00.000Z'),
    fechaFinEstimada: new Date('2026-12-01T00:00:00.000Z'),
    estadoProyecto: EstadoProyecto.PLANIFICACION,
    especificacionesTecnicas: 'Specs CU16',
  });

  const tareaExistente = new Tarea({
    idTarea: 8,
    nombre: 'Tarea CU16',
    descripcion: 'Tarea de prueba',
    tipoTarea: TipoTarea.OBRA_BRUTA,
    perfilRequerido: OcupacionTrabajador.ALBANIL,
    duracionEstimada: 4,
    fechaInicioPlanificada: new Date('2026-07-10T00:00:00.000Z'),
    fechaFinPlanificada: new Date('2026-07-14T00:00:00.000Z'),
    estadoTarea: EstadoTarea.PENDIENTE,
    prioridad: PrioridadTarea.MEDIA,
    idCronograma: 2,
  });

  const materialBarato = new Material({
    idMaterial: 12,
    nombre: 'Cemento',
    descripcion: 'Material barato',
    tipoMaterial: TipoMaterial.GENERAL,
    unidad: 'bolsa',
    cantidadDisponible: 10,
    costoUnitario: 12,
  });

  const materialCostoso = new Material({
    idMaterial: 13,
    nombre: 'Acero premium',
    descripcion: 'Material costoso',
    tipoMaterial: TipoMaterial.OBRA_BRUTA,
    unidad: 'barra',
    cantidadDisponible: 25,
    costoUnitario: 40,
  });

  beforeEach(() => {
    asignacionMaterialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    proyectoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsActiveByCliente: jest.fn(),
    };

    tareaRepositoryMock = {
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

    useCase = new GenerarPropuestaAsignacionMaterialUseCase(
      asignacionMaterialRepositoryMock,
      proyectoRepositoryMock,
      tareaRepositoryMock,
      materialRepositoryMock,
    );
  });

  it('genera propuesta correctamente con material disponible', async () => {
    const asignacionCreada = new AsignacionMaterial({
      idAsignacionMaterial: 22,
      idTarea: dtoBase.idTarea,
      idMaterial: materialBarato.idMaterial,
      cantidadAsignada: 1,
      fechaAsignacion: new Date(),
      criteriosPrioridad: dtoBase.criteriosPrioridad,
      costoMaximoPermitido: dtoBase.costoMaximoPermitido,
      restricciones: dtoBase.restricciones,
      estadoAsignacion: EstadoAsignacion.PENDIENTE,
      generadaPorIa: true,
    });

    proyectoRepositoryMock.findById.mockResolvedValue(proyectoExistente);
    tareaRepositoryMock.findById.mockResolvedValue(tareaExistente);
    materialRepositoryMock.findMany.mockResolvedValue([
      materialBarato,
      materialCostoso,
    ]);
    asignacionMaterialRepositoryMock.create.mockResolvedValue(asignacionCreada);

    const result = await useCase.execute(dtoBase);

    expect(materialRepositoryMock.findMany).toHaveBeenCalledWith();
    expect(asignacionMaterialRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idTarea: dtoBase.idTarea,
        idMaterial: materialBarato.idMaterial,
        cantidadAsignada: 1,
        estadoAsignacion: EstadoAsignacion.PENDIENTE,
        generadaPorIa: true,
        criteriosPrioridad: dtoBase.criteriosPrioridad,
        costoMaximoPermitido: dtoBase.costoMaximoPermitido,
        restricciones: dtoBase.restricciones,
      }),
    );
    expect(result).toBe(asignacionCreada);
  });

  it('lanza NotFoundException si proyecto no existe', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza NotFoundException si tarea no existe', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(proyectoExistente);
    tareaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza BadRequestException si no hay materiales disponibles', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(proyectoExistente);
    tareaRepositoryMock.findById.mockResolvedValue(tareaExistente);
    materialRepositoryMock.findMany.mockResolvedValue([
      new Material({
        idMaterial: 99,
        nombre: 'Sin stock',
        descripcion: 'No disponible',
        tipoMaterial: TipoMaterial.GENERAL,
        unidad: 'unidad',
        cantidadDisponible: 0,
        costoUnitario: 5,
      }),
    ]);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('respeta costoMaximoPermitido filtrando materiales', async () => {
    const asignacionCreada = new AsignacionMaterial({
      idAsignacionMaterial: 30,
      idMaterial: materialBarato.idMaterial,
      cantidadAsignada: 1,
      fechaAsignacion: new Date(),
      estadoAsignacion: EstadoAsignacion.PENDIENTE,
      generadaPorIa: true,
    });

    proyectoRepositoryMock.findById.mockResolvedValue(proyectoExistente);
    tareaRepositoryMock.findById.mockResolvedValue(tareaExistente);
    materialRepositoryMock.findMany.mockResolvedValue([
      materialCostoso,
      materialBarato,
    ]);
    asignacionMaterialRepositoryMock.create.mockResolvedValue(asignacionCreada);

    await useCase.execute(dtoBase);

    expect(asignacionMaterialRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idMaterial: materialBarato.idMaterial,
      }),
    );
  });
});
