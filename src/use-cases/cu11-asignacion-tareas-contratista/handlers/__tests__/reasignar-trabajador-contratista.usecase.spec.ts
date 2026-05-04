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
import { ReasignarTrabajadorContratistaDto } from '../../dto';
import { ReasignarTrabajadorContratistaUseCase } from '../reasignar-trabajador-contratista.usecase';

describe('ReasignarTrabajadorContratistaUseCase', () => {
  let useCase: ReasignarTrabajadorContratistaUseCase;
  let asignacionTareaRepositoryMock: jest.Mocked<AsignacionTareaRepository>;
  let trabajadorRepositoryMock: jest.Mocked<TrabajadorRepository>;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;
  let disponibilidadServiceMock: jest.Mocked<TrabajadorDisponibilidadService>;

  const dtoBase: ReasignarTrabajadorContratistaDto = {
    idAsignacionTarea: 40,
    idNuevoTrabajador: 23,
    motivoReasignacion: 'Cambio de cuadrilla',
  };

  const asignacionBase = new AsignacionTarea({
    idAsignacionTarea: 40,
    idTarea: 10,
    idTrabajador: 22,
    fechaAsignacion: new Date('2026-05-10T00:00:00.000Z'),
    rolEnLaTarea: 'Operario',
    estadoAsignacion: EstadoAsignacion.CONFIRMADA,
    observaciones: 'Asignacion inicial',
    asignadaPorContratista: true,
  });

  const tareaBase = new Tarea({
    idTarea: 10,
    nombre: 'Instalacion sanitaria principal',
    descripcion: 'Tarea de obra bruta',
    tipoTarea: TipoTarea.OBRA_BRUTA,
    perfilRequerido: OcupacionTrabajador.PLOMERO,
    duracionEstimada: 5,
    fechaInicioPlanificada: new Date('2026-05-10T00:00:00.000Z'),
    fechaFinPlanificada: new Date('2026-05-15T00:00:00.000Z'),
    estadoTarea: EstadoTarea.PENDIENTE,
    prioridad: PrioridadTarea.MEDIA,
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

    trabajadorRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByCiOrCorreo: jest.fn(),
      existsByCiOrCorreoExcludingId: jest.fn(),
    };

    tareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    disponibilidadServiceMock = {
      verificar: jest.fn(),
      validarDisponibleParaTarea: jest.fn(),
    } as unknown as jest.Mocked<TrabajadorDisponibilidadService>;

    useCase = new ReasignarTrabajadorContratistaUseCase(
      asignacionTareaRepositoryMock,
      trabajadorRepositoryMock,
      tareaRepositoryMock,
      disponibilidadServiceMock,
    );
  });

  it('reasigna trabajador correctamente', async () => {
    const asignacionActualizada = new AsignacionTarea({
      ...asignacionBase,
      idTrabajador: dtoBase.idNuevoTrabajador,
      estadoAsignacion: EstadoAsignacion.REASIGNADA,
      observaciones: dtoBase.motivoReasignacion,
    });

    asignacionTareaRepositoryMock.findById.mockResolvedValue(asignacionBase);
    trabajadorRepositoryMock.findById.mockResolvedValue(
      new Trabajador({
        idTrabajador: 23,
        nombre: 'Trabajador Nuevo',
        ci: 'CI-23',
        telefono: '70000023',
        correo: 'trabajador23@example.com',
        aniosExperiencia: 7,
        ocupacion: OcupacionTrabajador.PLOMERO,
      }),
    );
    asignacionTareaRepositoryMock.existsActiveAssignment.mockResolvedValue(
      false,
    );
    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);
    disponibilidadServiceMock.validarDisponibleParaTarea.mockResolvedValue();
    asignacionTareaRepositoryMock.update.mockResolvedValue(
      asignacionActualizada,
    );

    const result = await useCase.execute(dtoBase);

    expect(
      asignacionTareaRepositoryMock.existsActiveAssignment,
    ).toHaveBeenCalledWith(10, 23);
    expect(tareaRepositoryMock.findById).toHaveBeenCalledWith(10);
    expect(
      disponibilidadServiceMock.validarDisponibleParaTarea.mock.calls[0],
    ).toEqual([23, tareaBase, 40]);
    expect(asignacionTareaRepositoryMock.update).toHaveBeenCalledWith(40, {
      idTrabajador: 23,
      estadoAsignacion: EstadoAsignacion.REASIGNADA,
      observaciones: 'Cambio de cuadrilla',
    });
    expect(result).toBe(asignacionActualizada);
  });

  it('lanza NotFoundException si no existe asignacion', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza BadRequestException si la asignacion no es de contratista', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(
      new AsignacionTarea({
        ...asignacionBase,
        asignadaPorContratista: false,
      }),
    );

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('lanza NotFoundException si no existe nuevo trabajador', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(asignacionBase);
    trabajadorRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza BadRequestException si nuevo trabajador no es compatible', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(asignacionBase);
    trabajadorRepositoryMock.findById.mockResolvedValue(
      new Trabajador({
        idTrabajador: 23,
        nombre: 'Trabajador Incompatible',
        ci: 'CI-23',
        telefono: '70000023',
        correo: 'trabajador23@example.com',
        aniosExperiencia: 7,
        ocupacion: OcupacionTrabajador.CARPINTERO,
      }),
    );

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('lanza ConflictException si ya existe asignacion activa con el nuevo trabajador', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(asignacionBase);
    trabajadorRepositoryMock.findById.mockResolvedValue(
      new Trabajador({
        idTrabajador: 23,
        nombre: 'Trabajador Nuevo',
        ci: 'CI-23',
        telefono: '70000023',
        correo: 'trabajador23@example.com',
        aniosExperiencia: 7,
        ocupacion: OcupacionTrabajador.ALBANIL,
      }),
    );
    asignacionTareaRepositoryMock.existsActiveAssignment.mockResolvedValue(
      true,
    );
    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('lanza ConflictException si nuevo trabajador no esta disponible', async () => {
    asignacionTareaRepositoryMock.findById.mockResolvedValue(asignacionBase);
    trabajadorRepositoryMock.findById.mockResolvedValue(
      new Trabajador({
        idTrabajador: 23,
        nombre: 'Trabajador Nuevo',
        ci: 'CI-23',
        telefono: '70000023',
        correo: 'trabajador23@example.com',
        aniosExperiencia: 7,
        ocupacion: OcupacionTrabajador.ALBANIL,
      }),
    );
    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);
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
  });
});
