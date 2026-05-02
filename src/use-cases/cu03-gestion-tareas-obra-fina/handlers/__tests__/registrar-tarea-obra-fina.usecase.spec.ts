import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  Cronograma,
  EstadoCronograma,
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
  Tarea,
  TipoTarea,
} from '../../../../domain';
import type {
  CronogramaRepository,
  TareaRepository,
} from '../../../../infrastructure';
import { RegistrarTareaObraFinaDto } from '../../dto';
import { RegistrarTareaObraFinaUseCase } from '../registrar-tarea-obra-fina.usecase';

describe('RegistrarTareaObraFinaUseCase', () => {
  let useCase: RegistrarTareaObraFinaUseCase;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;
  let cronogramaRepositoryMock: jest.Mocked<CronogramaRepository>;

  const registrarDto: RegistrarTareaObraFinaDto = {
    idProyecto: 15,
    nombre: 'Instalacion de ventanales',
    descripcion: 'Montaje de ventanales templados',
    perfilRequerido: OcupacionTrabajador.VIDRIERO,
    duracionEstimada: 5,
    fechaInicioPlanificada: '2026-05-10T00:00:00.000Z',
    fechaFinPlanificada: '2026-05-15T00:00:00.000Z',
    prioridad: PrioridadTarea.ALTA,
  };

  beforeEach(() => {
    tareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    cronogramaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findByProyecto: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByProyecto: jest.fn(),
    };

    useCase = new RegistrarTareaObraFinaUseCase(
      tareaRepositoryMock,
      cronogramaRepositoryMock,
    );
  });

  it('crea tarea de obra fina correctamente si existe cronograma', async () => {
    cronogramaRepositoryMock.findByProyecto.mockResolvedValue(
      new Cronograma({
        idCronograma: 20,
        idProyecto: 15,
        nombre: 'Cronograma Base',
        fechaCreacion: new Date('2026-05-01T00:00:00.000Z'),
        estadoCronograma: EstadoCronograma.PLANIFICADO,
      }),
    );

    const tareaCreada = new Tarea({
      idTarea: 33,
      nombre: registrarDto.nombre,
      descripcion: registrarDto.descripcion,
      tipoTarea: TipoTarea.OBRA_FINA,
      perfilRequerido: registrarDto.perfilRequerido,
      duracionEstimada: registrarDto.duracionEstimada,
      fechaInicioPlanificada: new Date(registrarDto.fechaInicioPlanificada),
      fechaFinPlanificada: new Date(registrarDto.fechaFinPlanificada),
      estadoTarea: EstadoTarea.PENDIENTE,
      prioridad: registrarDto.prioridad,
      idCronograma: 20,
    });

    tareaRepositoryMock.create.mockResolvedValue(tareaCreada);

    const result = await useCase.execute(registrarDto);

    expect(cronogramaRepositoryMock.findByProyecto).toHaveBeenCalledWith(15);
    expect(tareaRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        tipoTarea: TipoTarea.OBRA_FINA,
        estadoTarea: EstadoTarea.PENDIENTE,
        idCronograma: 20,
      }),
    );
    expect(result).toBe(tareaCreada);
  });

  it('lanza NotFoundException si no existe cronograma', async () => {
    cronogramaRepositoryMock.findByProyecto.mockResolvedValue(null);

    await expect(useCase.execute(registrarDto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(tareaRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si fechaFinPlanificada es anterior a fechaInicioPlanificada', async () => {
    cronogramaRepositoryMock.findByProyecto.mockResolvedValue(
      new Cronograma({
        idCronograma: 20,
        idProyecto: 15,
        nombre: 'Cronograma Base',
        fechaCreacion: new Date('2026-05-01T00:00:00.000Z'),
        estadoCronograma: EstadoCronograma.PLANIFICADO,
      }),
    );

    await expect(
      useCase.execute({
        ...registrarDto,
        fechaInicioPlanificada: '2026-05-20T00:00:00.000Z',
        fechaFinPlanificada: '2026-05-15T00:00:00.000Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lanza BadRequestException si perfilRequerido no es VIDRIERO ni CARPINTERO', async () => {
    cronogramaRepositoryMock.findByProyecto.mockResolvedValue(
      new Cronograma({
        idCronograma: 20,
        idProyecto: 15,
        nombre: 'Cronograma Base',
        fechaCreacion: new Date('2026-05-01T00:00:00.000Z'),
        estadoCronograma: EstadoCronograma.PLANIFICADO,
      }),
    );

    await expect(
      useCase.execute({
        ...registrarDto,
        perfilRequerido: OcupacionTrabajador.ELECTRICISTA,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
