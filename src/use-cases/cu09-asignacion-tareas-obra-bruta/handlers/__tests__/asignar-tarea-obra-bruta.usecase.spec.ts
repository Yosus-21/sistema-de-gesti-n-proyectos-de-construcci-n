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
import { AsignarTareaObraBrutaDto } from '../../dto';
import { AsignarTareaObraBrutaUseCase } from '../asignar-tarea-obra-bruta.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('AsignarTareaObraBrutaUseCase', () => {
  let useCase: AsignarTareaObraBrutaUseCase;
  let asignacionTareaRepositoryMock: jest.Mocked<AsignacionTareaRepository>;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;
  let trabajadorRepositoryMock: jest.Mocked<TrabajadorRepository>;

  const dtoBase: AsignarTareaObraBrutaDto = {
    idTarea: 10,
    idTrabajador: 22,
    fechaAsignacion: '2026-05-10T00:00:00.000Z',
    rolEnLaTarea: 'Responsable de obra bruta',
    observaciones: 'Asignacion inicial',
  };

  const tareaObraBruta = new Tarea({
    idTarea: 10,
    nombre: 'Instalacion hidraulica principal',
    descripcion: 'Tarea de obra bruta',
    tipoTarea: TipoTarea.OBRA_BRUTA,
    perfilRequerido: OcupacionTrabajador.PLOMERO,
    duracionEstimada: 5,
    fechaInicioPlanificada: new Date('2026-05-10T00:00:00.000Z'),
    fechaFinPlanificada: new Date('2026-05-15T00:00:00.000Z'),
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
    ocupacion: OcupacionTrabajador.ALBANIL,
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

    useCase = new AsignarTareaObraBrutaUseCase(
      asignacionTareaRepositoryMock,
      tareaRepositoryMock,
      trabajadorRepositoryMock,
    );
  });

  it('asigna tarea de obra bruta correctamente', async () => {
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

    tareaRepositoryMock.findById.mockResolvedValue(tareaObraBruta);
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorCompatible);
    asignacionTareaRepositoryMock.existsActiveAssignment.mockResolvedValue(
      false,
    );
    asignacionTareaRepositoryMock.create.mockResolvedValue(asignacionCreada);

    const result = await useCase.execute(dtoBase);

    expect(tareaRepositoryMock.findById).toHaveBeenCalledWith(dtoBase.idTarea);
    expect(trabajadorRepositoryMock.findById).toHaveBeenCalledWith(
      dtoBase.idTrabajador,
    );
    expect(
      asignacionTareaRepositoryMock.existsActiveAssignment,
    ).toHaveBeenCalledWith(dtoBase.idTarea, dtoBase.idTrabajador);
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

  it('lanza BadRequestException si la tarea no es OBRA_BRUTA', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(
      new Tarea({
        ...tareaObraBruta,
        tipoTarea: TipoTarea.OBRA_FINA,
      }),
    );

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(trabajadorRepositoryMock.findById).not.toHaveBeenCalled();
  });

  it('lanza NotFoundException si no existe trabajador', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaObraBruta);
    trabajadorRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(
      asignacionTareaRepositoryMock.existsActiveAssignment,
    ).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si trabajador no tiene ocupacion compatible', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaObraBruta);
    trabajadorRepositoryMock.findById.mockResolvedValue(
      new Trabajador({
        ...trabajadorCompatible,
        ocupacion: OcupacionTrabajador.CARPINTERO,
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
    tareaRepositoryMock.findById.mockResolvedValue(tareaObraBruta);
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorCompatible);
    asignacionTareaRepositoryMock.existsActiveAssignment.mockResolvedValue(
      true,
    );

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(asignacionTareaRepositoryMock.create).not.toHaveBeenCalled();
  });
});
