import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
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
import type { TrabajadorDisponibilidadService } from '../../../shared';
import { AsignarTareaObraFinaDto } from '../../dto';
import { AsignarTareaObraFinaUseCase } from '../asignar-tarea-obra-fina.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('AsignarTareaObraFinaUseCase', () => {
  let useCase: AsignarTareaObraFinaUseCase;
  let asignacionTareaRepositoryMock: jest.Mocked<AsignacionTareaRepository>;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;
  let trabajadorRepositoryMock: jest.Mocked<TrabajadorRepository>;
  let disponibilidadServiceMock: jest.Mocked<TrabajadorDisponibilidadService>;

  const dtoBase: AsignarTareaObraFinaDto = {
    idTarea: 10,
    idTrabajador: 22,
    fechaAsignacion: '2026-05-10T00:00:00.000Z',
    rolEnLaTarea: 'Especialista en acabados',
    observaciones: 'Asignacion inicial',
  };

  const tareaObraFina = new Tarea({
    idTarea: 10,
    nombre: 'Instalacion de vidrio templado',
    descripcion: 'Tarea de obra fina',
    tipoTarea: TipoTarea.OBRA_FINA,
    perfilRequerido: OcupacionTrabajador.VIDRIERO,
    duracionEstimada: 3,
    fechaInicioPlanificada: new Date('2026-05-10T00:00:00.000Z'),
    fechaFinPlanificada: new Date('2026-05-13T00:00:00.000Z'),
    estadoTarea: EstadoTarea.PENDIENTE,
    prioridad: PrioridadTarea.MEDIA,
    idCronograma: 5,
  });

  const trabajadorCompatible = new Trabajador({
    idTrabajador: 22,
    nombre: 'Trabajador Base',
    ci: 'CI-22',
    telefono: '70000022',
    correo: 'trabajador22@example.com',
    aniosExperiencia: 8,
    ocupacion: OcupacionTrabajador.VIDRIERO,
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

    disponibilidadServiceMock = {
      verificar: jest.fn(),
      validarDisponibleParaTarea: jest.fn(),
    } as unknown as jest.Mocked<TrabajadorDisponibilidadService>;

    useCase = new AsignarTareaObraFinaUseCase(
      asignacionTareaRepositoryMock,
      tareaRepositoryMock,
      trabajadorRepositoryMock,
      disponibilidadServiceMock,
    );
  });

  it('asigna tarea de obra fina correctamente', async () => {
    const asignacionCreada = new AsignacionTarea({
      idAsignacionTarea: 33,
      idTarea: dtoBase.idTarea,
      idTrabajador: dtoBase.idTrabajador,
      fechaAsignacion: new Date(dtoBase.fechaAsignacion),
      rolEnLaTarea: dtoBase.rolEnLaTarea,
      estadoAsignacion: EstadoAsignacion.CONFIRMADA,
      observaciones: dtoBase.observaciones,
      asignadaPorContratista: false,
    });

    tareaRepositoryMock.findById.mockResolvedValue(tareaObraFina);
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorCompatible);
    asignacionTareaRepositoryMock.existsActiveAssignment.mockResolvedValue(
      false,
    );
    disponibilidadServiceMock.validarDisponibleParaTarea.mockResolvedValue();
    asignacionTareaRepositoryMock.create.mockResolvedValue(asignacionCreada);

    const result = await useCase.execute(dtoBase);

    expect(tareaRepositoryMock.findById).toHaveBeenCalledWith(dtoBase.idTarea);
    expect(trabajadorRepositoryMock.findById).toHaveBeenCalledWith(
      dtoBase.idTrabajador,
    );
    expect(
      asignacionTareaRepositoryMock.existsActiveAssignment,
    ).toHaveBeenCalledWith(dtoBase.idTarea, dtoBase.idTrabajador);
    expect(
      disponibilidadServiceMock.validarDisponibleParaTarea.mock.calls[0],
    ).toEqual([dtoBase.idTrabajador, tareaObraFina]);
    expect(asignacionTareaRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idTarea: dtoBase.idTarea,
        idTrabajador: dtoBase.idTrabajador,
        fechaAsignacion: expectAnyDate(),
        rolEnLaTarea: dtoBase.rolEnLaTarea,
        estadoAsignacion: EstadoAsignacion.CONFIRMADA,
        observaciones: dtoBase.observaciones,
        asignadaPorContratista: false,
      }),
    );
    expect(result).toBe(asignacionCreada);
  });

  it('lanza NotFoundException si no existe tarea', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(trabajadorRepositoryMock.findById).not.toHaveBeenCalled();
    expect(asignacionTareaRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si la tarea no es OBRA_FINA', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(
      new Tarea({
        ...tareaObraFina,
        tipoTarea: TipoTarea.OBRA_BRUTA,
      }),
    );

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(trabajadorRepositoryMock.findById).not.toHaveBeenCalled();
  });

  it('lanza NotFoundException si no existe trabajador', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaObraFina);
    trabajadorRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(
      asignacionTareaRepositoryMock.existsActiveAssignment,
    ).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si trabajador no tiene ocupacion compatible', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaObraFina);
    trabajadorRepositoryMock.findById.mockResolvedValue(
      new Trabajador({
        ...trabajadorCompatible,
        ocupacion: OcupacionTrabajador.ALBANIL,
      }),
    );

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(
      asignacionTareaRepositoryMock.existsActiveAssignment,
    ).not.toHaveBeenCalled();
  });

  it('lanza ConflictException si ya existe asignacion activa', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaObraFina);
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorCompatible);
    asignacionTareaRepositoryMock.existsActiveAssignment.mockResolvedValue(
      true,
    );

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(asignacionTareaRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('lanza ConflictException si el trabajador no esta disponible', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaObraFina);
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorCompatible);
    asignacionTareaRepositoryMock.existsActiveAssignment.mockResolvedValue(
      false,
    );
    disponibilidadServiceMock.validarDisponibleParaTarea.mockRejectedValue(
      new ConflictException(
        'El trabajador no está disponible en el rango de fechas de la tarea.',
      ),
    );

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(asignacionTareaRepositoryMock.create).not.toHaveBeenCalled();
  });
});
