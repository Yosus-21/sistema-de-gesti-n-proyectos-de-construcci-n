import { NotFoundException } from '@nestjs/common';
import {
  EstadoProyecto,
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
  Proyecto,
  Tarea,
  TipoTarea,
} from '../../../../domain';
import type {
  ProyectoRepository,
  TareaRepository,
} from '../../../../infrastructure';
import { ValidarRestriccionesAsignacionMaterialDto } from '../../dto';
import { ValidarRestriccionesAsignacionMaterialUseCase } from '../validar-restricciones-asignacion-material.usecase';

describe('ValidarRestriccionesAsignacionMaterialUseCase', () => {
  let useCase: ValidarRestriccionesAsignacionMaterialUseCase;
  let proyectoRepositoryMock: jest.Mocked<ProyectoRepository>;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;

  const dtoBase: ValidarRestriccionesAsignacionMaterialDto = {
    idProyecto: 7,
    idTarea: 14,
    restricciones: 'No usar fuera de la fase inicial',
  };

  const proyectoExistente = new Proyecto({
    idProyecto: 7,
    nombre: 'Proyecto restricciones',
    descripcion: 'Proyecto de prueba',
    ubicacion: 'Cochabamba',
    presupuesto: 120000,
    fechaInicio: new Date('2026-08-01T00:00:00.000Z'),
    fechaFinEstimada: new Date('2026-12-01T00:00:00.000Z'),
    estadoProyecto: EstadoProyecto.PLANIFICACION,
    especificacionesTecnicas: 'Specs CU16',
  });

  const tareaExistente = new Tarea({
    idTarea: 14,
    nombre: 'Tarea restricciones',
    descripcion: 'Tarea de prueba',
    tipoTarea: TipoTarea.OBRA_FINA,
    perfilRequerido: OcupacionTrabajador.CARPINTERO,
    duracionEstimada: 2,
    fechaInicioPlanificada: new Date('2026-08-10T00:00:00.000Z'),
    fechaFinPlanificada: new Date('2026-08-12T00:00:00.000Z'),
    estadoTarea: EstadoTarea.PENDIENTE,
    prioridad: PrioridadTarea.MEDIA,
  });

  beforeEach(() => {
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

    useCase = new ValidarRestriccionesAsignacionMaterialUseCase(
      proyectoRepositoryMock,
      tareaRepositoryMock,
    );
  });

  it('retorna válido true con restricciones', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(proyectoExistente);
    tareaRepositoryMock.findById.mockResolvedValue(tareaExistente);

    const result = await useCase.execute(dtoBase);

    expect(result).toEqual({
      valido: true,
      idProyecto: dtoBase.idProyecto,
      idTarea: dtoBase.idTarea,
      restricciones: dtoBase.restricciones,
      mensaje: 'Restricciones validadas de forma provisional.',
    });
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
});
