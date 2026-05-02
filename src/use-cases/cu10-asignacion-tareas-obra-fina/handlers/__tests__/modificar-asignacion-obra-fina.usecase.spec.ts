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
import { ModificarAsignacionObraFinaDto } from '../../dto';
import { ModificarAsignacionObraFinaUseCase } from '../modificar-asignacion-obra-fina.usecase';

describe('ModificarAsignacionObraFinaUseCase', () => {
  let useCase: ModificarAsignacionObraFinaUseCase;
  let asignacionTareaRepositoryMock: jest.Mocked<AsignacionTareaRepository>;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;
  let trabajadorRepositoryMock: jest.Mocked<TrabajadorRepository>;

  const dtoBase: ModificarAsignacionObraFinaDto = {
    idAsignacionTarea: 40,
    rolEnLaTarea: 'Supervisor de acabados',
    observaciones: 'Cambio de rol',
  };

  const asignacionBase = new AsignacionTarea({
    idAsignacionTarea: 40,
    idTarea: 10,
    idTrabajador: 22,
    fechaAsignacion: new Date('2026-05-10T00:00:00.000Z'),
    rolEnLaTarea: 'Operario',
    estadoAsignacion: EstadoAsignacion.CONFIRMADA,
    asignadaPorContratista: false,
  });

  beforeEach(() => {
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

    trabajadorRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByCiOrCorreo: jest.fn(),
      existsByCiOrCorreoExcludingId: jest.fn(),
    };

    useCase = new ModificarAsignacionObraFinaUseCase(
      asignacionTareaRepositoryMock,
      tareaRepositoryMock,
      trabajadorRepositoryMock,
    );
  });

  it('modifica asignacion existente', async () => {
    const asignacionActualizada = new AsignacionTarea({
      ...asignacionBase,
      rolEnLaTarea: dtoBase.rolEnLaTarea,
      observaciones: dtoBase.observaciones,
    });

    asignacionTareaRepositoryMock.findById.mockResolvedValue(asignacionBase);
    asignacionTareaRepositoryMock.update.mockResolvedValue(
      asignacionActualizada,
    );

    const result = await useCase.execute(dtoBase);

    expect(asignacionTareaRepositoryMock.update).toHaveBeenCalledWith(
      dtoBase.idAsignacionTarea,
      {
        rolEnLaTarea: dtoBase.rolEnLaTarea,
        observaciones: dtoBase.observaciones,
      },
    );
    expect(result).toBe(asignacionActualizada);
  });

  it('lanza NotFoundException si no existe asignacion', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(asignacionTareaRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si nueva tarea no es OBRA_FINA', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(asignacionBase);
    tareaRepositoryMock.findById.mockResolvedValue(
      new Tarea({
        idTarea: 99,
        nombre: 'Tarea bruta',
        descripcion: 'No compatible',
        tipoTarea: TipoTarea.OBRA_BRUTA,
        perfilRequerido: OcupacionTrabajador.ALBANIL,
        duracionEstimada: 2,
        fechaInicioPlanificada: new Date('2026-05-10T00:00:00.000Z'),
        fechaFinPlanificada: new Date('2026-05-12T00:00:00.000Z'),
        estadoTarea: EstadoTarea.PENDIENTE,
        prioridad: PrioridadTarea.MEDIA,
      }),
    );

    await expect(
      useCase.execute({
        ...dtoBase,
        idTarea: 99,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lanza BadRequestException si nuevo trabajador no es compatible', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(asignacionBase);
    trabajadorRepositoryMock.findById.mockResolvedValue(
      new Trabajador({
        idTrabajador: 88,
        nombre: 'Trabajador incompatible',
        ci: 'CI-88',
        telefono: '70000088',
        correo: 'trabajador88@example.com',
        aniosExperiencia: 5,
        ocupacion: OcupacionTrabajador.ELECTRICISTA,
      }),
    );

    await expect(
      useCase.execute({
        ...dtoBase,
        idTrabajador: 88,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
