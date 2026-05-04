import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  AsignacionTarea,
  EstadoAsignacion,
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
  Tarea,
  TipoTarea,
  Trabajador,
} from '../../../../domain';
import type {
  AsignacionTareaRepository,
  TareaRepository,
  TrabajadorRepository,
} from '../../../../infrastructure';
import { TrabajadorDisponibilidadService } from '../../../shared';
import { VerificarDisponibilidadTrabajadorUseCase } from '../verificar-disponibilidad-trabajador.usecase';

describe('VerificarDisponibilidadTrabajadorUseCase', () => {
  let useCase: VerificarDisponibilidadTrabajadorUseCase;
  let trabajadorRepositoryMock: jest.Mocked<TrabajadorRepository>;
  let asignacionTareaRepositoryMock: jest.Mocked<AsignacionTareaRepository>;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;

  const trabajadorBase = new Trabajador({
    idTrabajador: 3,
    nombre: 'Carlos Soto',
    ci: 'CI-3',
    telefono: '70000003',
    correo: 'carlos@example.com',
    aniosExperiencia: 5,
    ocupacion: OcupacionTrabajador.VIDRIERO,
  });

  const tareaBase = new Tarea({
    idTarea: 10,
    nombre: 'Instalacion de mamparas',
    descripcion: 'Tarea de obra fina',
    tipoTarea: TipoTarea.OBRA_FINA,
    perfilRequerido: OcupacionTrabajador.VIDRIERO,
    duracionEstimada: 3,
    fechaInicioPlanificada: new Date('2026-05-11T00:00:00.000Z'),
    fechaFinPlanificada: new Date('2026-05-13T00:00:00.000Z'),
    estadoTarea: EstadoTarea.PENDIENTE,
    prioridad: PrioridadTarea.MEDIA,
  });

  const asignacionBase = new AsignacionTarea({
    idAsignacionTarea: 20,
    idTarea: 10,
    idTrabajador: 3,
    fechaAsignacion: new Date('2026-05-09T00:00:00.000Z'),
    rolEnLaTarea: 'Especialista',
    estadoAsignacion: EstadoAsignacion.CONFIRMADA,
    asignadaPorContratista: false,
  });

  beforeEach(() => {
    trabajadorRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByCiOrCorreo: jest.fn(),
      existsByCiOrCorreoExcludingId: jest.fn(),
    };

    asignacionTareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsActiveAssignment: jest.fn(),
    };

    tareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const disponibilidadService = new TrabajadorDisponibilidadService(
      asignacionTareaRepositoryMock,
      tareaRepositoryMock,
    );

    useCase = new VerificarDisponibilidadTrabajadorUseCase(
      trabajadorRepositoryMock,
      disponibilidadService,
    );
  });

  it('retorna disponible true si trabajador existe y no tiene asignaciones', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorBase);
    asignacionTareaRepositoryMock.findMany.mockResolvedValue([]);

    await expect(
      useCase.execute({
        idTrabajador: 3,
        fechaInicio: '2026-05-10',
        fechaFin: '2026-05-12',
      }),
    ).resolves.toEqual({
      idTrabajador: 3,
      disponible: true,
      fechaInicio: '2026-05-10T00:00:00.000Z',
      fechaFin: '2026-05-12T00:00:00.000Z',
      conflictos: [],
    });
  });

  it('retorna disponible false si existe asignacion activa solapada', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorBase);
    asignacionTareaRepositoryMock.findMany.mockResolvedValue([asignacionBase]);
    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);

    await expect(
      useCase.execute({
        idTrabajador: 3,
        fechaInicio: '2026-05-10',
        fechaFin: '2026-05-12',
      }),
    ).resolves.toEqual({
      idTrabajador: 3,
      disponible: false,
      fechaInicio: '2026-05-10T00:00:00.000Z',
      fechaFin: '2026-05-12T00:00:00.000Z',
      conflictos: [
        {
          idAsignacionTarea: 20,
          idTarea: 10,
          nombreTarea: 'Instalacion de mamparas',
          fechaInicio: '2026-05-11T00:00:00.000Z',
          fechaFin: '2026-05-13T00:00:00.000Z',
          estadoAsignacion: EstadoAsignacion.CONFIRMADA,
        },
      ],
    });
  });

  it('retorna disponible true si la asignacion activa no se solapa', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorBase);
    asignacionTareaRepositoryMock.findMany.mockResolvedValue([asignacionBase]);
    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);

    await expect(
      useCase.execute({
        idTrabajador: 3,
        fechaInicio: '2026-05-20',
        fechaFin: '2026-05-22',
      }),
    ).resolves.toEqual({
      idTrabajador: 3,
      disponible: true,
      fechaInicio: '2026-05-20T00:00:00.000Z',
      fechaFin: '2026-05-22T00:00:00.000Z',
      conflictos: [],
    });
  });

  it('ignora asignaciones canceladas', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorBase);
    asignacionTareaRepositoryMock.findMany.mockResolvedValue([
      new AsignacionTarea({
        ...asignacionBase,
        estadoAsignacion: EstadoAsignacion.CANCELADA,
      }),
    ]);

    await expect(
      useCase.execute({
        idTrabajador: 3,
        fechaInicio: '2026-05-10',
        fechaFin: '2026-05-12',
      }),
    ).resolves.toEqual({
      idTrabajador: 3,
      disponible: true,
      fechaInicio: '2026-05-10T00:00:00.000Z',
      fechaFin: '2026-05-12T00:00:00.000Z',
      conflictos: [],
    });
    expect(tareaRepositoryMock.findById).not.toHaveBeenCalled();
  });

  it('lanza NotFoundException si trabajador no existe', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idTrabajador: 404,
        fechaInicio: '2026-05-10',
        fechaFin: '2026-05-12',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza BadRequestException si fechaFin es anterior a fechaInicio', async () => {
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorBase);

    await expect(
      useCase.execute({
        idTrabajador: 3,
        fechaInicio: '2026-05-12',
        fechaFin: '2026-05-10',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
