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
  ContratistaRepository,
  TareaRepository,
  TrabajadorRepository,
} from '../../../../infrastructure';
import type { TrabajadorDisponibilidadService } from '../../../shared';
import { AsignarTareaContratistaDto } from '../../dto';
import { AsignarTareaContratistaUseCase } from '../asignar-tarea-contratista.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('AsignarTareaContratistaUseCase', () => {
  let useCase: AsignarTareaContratistaUseCase;
  let asignacionTareaRepositoryMock: jest.Mocked<AsignacionTareaRepository>;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;
  let trabajadorRepositoryMock: jest.Mocked<TrabajadorRepository>;
  let contratistaRepositoryMock: jest.Mocked<ContratistaRepository>;
  let disponibilidadServiceMock: jest.Mocked<TrabajadorDisponibilidadService>;

  const dtoBase: AsignarTareaContratistaDto = {
    idTarea: 10,
    idTrabajador: 22,
    idContratista: 30,
    fechaAsignacion: '2026-05-10T00:00:00.000Z',
    rolEnLaTarea: 'Operario principal',
    observaciones: 'Asignacion inicial',
  };

  const tareaObraBruta = new Tarea({
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

    contratistaRepositoryMock = {
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

    useCase = new AsignarTareaContratistaUseCase(
      asignacionTareaRepositoryMock,
      tareaRepositoryMock,
      trabajadorRepositoryMock,
      contratistaRepositoryMock,
      disponibilidadServiceMock,
    );
  });

  it('asigna tarea de obra bruta por contratista correctamente', async () => {
    const asignacionCreada = new AsignacionTarea({
      idAsignacionTarea: 33,
      idTarea: dtoBase.idTarea,
      idTrabajador: dtoBase.idTrabajador,
      fechaAsignacion: new Date(dtoBase.fechaAsignacion),
      rolEnLaTarea: dtoBase.rolEnLaTarea,
      estadoAsignacion: EstadoAsignacion.CONFIRMADA,
      observaciones: dtoBase.observaciones,
      asignadaPorContratista: true,
    });

    tareaRepositoryMock.findById.mockResolvedValue(tareaObraBruta);
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorCompatible);
    contratistaRepositoryMock.findById.mockResolvedValue({
      idContratista: 30,
      nombre: 'Contratista Base',
      ci: 'CI-30',
      empresa: 'Constructora Base',
      telefono: '70000030',
      correo: 'contratista30@example.com',
    } as never);
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
    expect(contratistaRepositoryMock.findById).toHaveBeenCalledWith(
      dtoBase.idContratista,
    );
    expect(
      disponibilidadServiceMock.validarDisponibleParaTarea.mock.calls[0],
    ).toEqual([dtoBase.idTrabajador, tareaObraBruta]);
    expect(asignacionTareaRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idTarea: dtoBase.idTarea,
        idTrabajador: dtoBase.idTrabajador,
        fechaAsignacion: expectAnyDate(),
        rolEnLaTarea: dtoBase.rolEnLaTarea,
        estadoAsignacion: EstadoAsignacion.CONFIRMADA,
        observaciones: dtoBase.observaciones,
        asignadaPorContratista: true,
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
  });

  it('lanza NotFoundException si no existe trabajador', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaObraBruta);
    trabajadorRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
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
  });

  it('lanza NotFoundException si idContratista viene y no existe contratista', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaObraBruta);
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorCompatible);
    contratistaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza ConflictException si ya existe asignacion activa', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaObraBruta);
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorCompatible);
    contratistaRepositoryMock.findById.mockResolvedValue({
      idContratista: 30,
      nombre: 'Contratista Base',
      ci: 'CI-30',
      empresa: 'Constructora Base',
      telefono: '70000030',
      correo: 'contratista30@example.com',
    } as never);
    asignacionTareaRepositoryMock.existsActiveAssignment.mockResolvedValue(
      true,
    );

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(asignacionTareaRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('lanza ConflictException si el trabajador no esta disponible', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaObraBruta);
    trabajadorRepositoryMock.findById.mockResolvedValue(trabajadorCompatible);
    contratistaRepositoryMock.findById.mockResolvedValue({
      idContratista: 30,
      nombre: 'Contratista Base',
      ci: 'CI-30',
      empresa: 'Constructora Base',
      telefono: '70000030',
      correo: 'contratista30@example.com',
    } as never);
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
