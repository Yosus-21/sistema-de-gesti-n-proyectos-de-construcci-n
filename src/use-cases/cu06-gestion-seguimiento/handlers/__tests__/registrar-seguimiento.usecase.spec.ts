import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
  Seguimiento,
  Tarea,
  TipoTarea,
} from '../../../../domain';
import type {
  SeguimientoRepository,
  TareaRepository,
} from '../../../../infrastructure';
import { RegistrarSeguimientoDto } from '../../dto';
import { RegistrarSeguimientoUseCase } from '../registrar-seguimiento.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('RegistrarSeguimientoUseCase', () => {
  let useCase: RegistrarSeguimientoUseCase;
  let seguimientoRepositoryMock: jest.Mocked<SeguimientoRepository>;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;

  const tareaBase = new Tarea({
    idTarea: 18,
    nombre: 'Instalacion base',
    descripcion: 'Tarea para seguimiento',
    tipoTarea: TipoTarea.OBRA_FINA,
    perfilRequerido: OcupacionTrabajador.CARPINTERO,
    duracionEstimada: 5,
    fechaInicioPlanificada: new Date('2026-05-10T00:00:00.000Z'),
    fechaFinPlanificada: new Date('2099-12-31T00:00:00.000Z'),
    estadoTarea: EstadoTarea.PENDIENTE,
    prioridad: PrioridadTarea.MEDIA,
    idCronograma: 4,
  });

  const dtoBase: RegistrarSeguimientoDto = {
    idTarea: 18,
    fechaSeguimiento: '2026-05-12T00:00:00.000Z',
    estadoReportado: 'En curso',
    cantidadMaterialUsado: 12.5,
    porcentajeAvance: 30,
    observaciones: 'Seguimiento inicial',
  };

  beforeEach(() => {
    seguimientoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    tareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new RegistrarSeguimientoUseCase(
      seguimientoRepositoryMock,
      tareaRepositoryMock,
    );
  });

  it('registra seguimiento correctamente si la tarea existe', async () => {
    const seguimientoCreado = new Seguimiento({
      idSeguimiento: 30,
      idTarea: dtoBase.idTarea,
      fechaSeguimiento: new Date(dtoBase.fechaSeguimiento),
      estadoReportado: dtoBase.estadoReportado,
      cantidadMaterialUsado: dtoBase.cantidadMaterialUsado,
      porcentajeAvance: dtoBase.porcentajeAvance,
      observaciones: dtoBase.observaciones,
    });

    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);
    seguimientoRepositoryMock.create.mockResolvedValue(seguimientoCreado);
    tareaRepositoryMock.update.mockResolvedValue(
      new Tarea({
        ...tareaBase,
        fechaInicioReal: new Date(dtoBase.fechaSeguimiento),
        estadoTarea: EstadoTarea.EN_PROCESO,
      }),
    );

    const result = await useCase.execute(dtoBase);

    expect(seguimientoRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idTarea: dtoBase.idTarea,
        fechaSeguimiento: expectAnyDate(),
        estadoReportado: dtoBase.estadoReportado,
        porcentajeAvance: dtoBase.porcentajeAvance,
      }),
    );
    expect(result).toBe(seguimientoCreado);
  });

  it('lanza NotFoundException si no existe la tarea', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(seguimientoRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('actualiza tarea con fechaInicioReal cuando porcentajeAvance > 0', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);
    seguimientoRepositoryMock.create.mockResolvedValue(
      new Seguimiento({
        idSeguimiento: 30,
        idTarea: dtoBase.idTarea,
        fechaSeguimiento: new Date(dtoBase.fechaSeguimiento),
        estadoReportado: dtoBase.estadoReportado,
        cantidadMaterialUsado: dtoBase.cantidadMaterialUsado,
        porcentajeAvance: dtoBase.porcentajeAvance,
        observaciones: dtoBase.observaciones,
      }),
    );
    tareaRepositoryMock.update.mockResolvedValue(
      new Tarea({
        ...tareaBase,
        fechaInicioReal: new Date(dtoBase.fechaSeguimiento),
        estadoTarea: EstadoTarea.EN_PROCESO,
      }),
    );

    await useCase.execute(dtoBase);

    expect(tareaRepositoryMock.update).toHaveBeenCalledWith(
      dtoBase.idTarea,
      expect.objectContaining({
        fechaInicioReal: expectAnyDate(),
        estadoTarea: EstadoTarea.EN_PROCESO,
      }),
    );
  });

  it('actualiza tarea con fechaFinReal y estado COMPLETADA cuando porcentajeAvance >= 100', async () => {
    const dto: RegistrarSeguimientoDto = {
      ...dtoBase,
      porcentajeAvance: 100,
    };

    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);
    seguimientoRepositoryMock.create.mockResolvedValue(
      new Seguimiento({
        idSeguimiento: 31,
        idTarea: dto.idTarea,
        fechaSeguimiento: new Date(dto.fechaSeguimiento),
        estadoReportado: dto.estadoReportado,
        cantidadMaterialUsado: dto.cantidadMaterialUsado,
        porcentajeAvance: dto.porcentajeAvance,
        observaciones: dto.observaciones,
      }),
    );
    tareaRepositoryMock.update.mockResolvedValue(
      new Tarea({
        ...tareaBase,
        fechaInicioReal: new Date(dto.fechaSeguimiento),
        fechaFinReal: new Date(dto.fechaSeguimiento),
        estadoTarea: EstadoTarea.COMPLETADA,
      }),
    );

    await useCase.execute(dto);

    expect(tareaRepositoryMock.update).toHaveBeenCalledWith(
      dto.idTarea,
      expect.objectContaining({
        fechaInicioReal: expectAnyDate(),
        fechaFinReal: expectAnyDate(),
        estadoTarea: EstadoTarea.COMPLETADA,
      }),
    );
  });

  it('lanza BadRequestException si porcentajeAvance esta fuera de rango', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(tareaBase);

    await expect(
      useCase.execute({
        ...dtoBase,
        porcentajeAvance: 120,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
