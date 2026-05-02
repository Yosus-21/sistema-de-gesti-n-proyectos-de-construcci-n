import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  Alerta,
  EstadoAlerta,
  EstadoProyecto,
  EstadoTarea,
  Material,
  MetodoNotificacion,
  OcupacionTrabajador,
  PrioridadTarea,
  Proyecto,
  Tarea,
  TipoAlerta,
  TipoMaterial,
  TipoTarea,
} from '../../../../domain';
import type {
  AlertaRepository,
  MaterialRepository,
  ProyectoRepository,
  TareaRepository,
} from '../../../../infrastructure';
import { ConfigurarAlertaDto } from '../../dto';
import { ConfigurarAlertaUseCase } from '../configurar-alerta.usecase';

describe('ConfigurarAlertaUseCase', () => {
  let useCase: ConfigurarAlertaUseCase;
  let alertaRepositoryMock: jest.Mocked<AlertaRepository>;
  let proyectoRepositoryMock: jest.Mocked<ProyectoRepository>;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const proyectoExistente = new Proyecto({
    idProyecto: 5,
    nombre: 'Proyecto CU18',
    descripcion: 'Proyecto de prueba',
    ubicacion: 'La Paz',
    presupuesto: 100000,
    fechaInicio: new Date('2026-12-01T00:00:00.000Z'),
    fechaFinEstimada: new Date('2027-01-01T00:00:00.000Z'),
    estadoProyecto: EstadoProyecto.PLANIFICACION,
    especificacionesTecnicas: 'Specs CU18',
  });

  const tareaExistente = new Tarea({
    idTarea: 9,
    nombre: 'Tarea CU18',
    descripcion: 'Tarea de prueba',
    tipoTarea: TipoTarea.OBRA_BRUTA,
    perfilRequerido: OcupacionTrabajador.ALBANIL,
    duracionEstimada: 2,
    fechaInicioPlanificada: new Date('2026-12-10T00:00:00.000Z'),
    fechaFinPlanificada: new Date('2026-12-12T00:00:00.000Z'),
    estadoTarea: EstadoTarea.PENDIENTE,
    prioridad: PrioridadTarea.MEDIA,
  });

  const materialExistente = new Material({
    idMaterial: 11,
    nombre: 'Cemento',
    descripcion: 'Material de prueba',
    tipoMaterial: TipoMaterial.GENERAL,
    unidad: 'bolsa',
    cantidadDisponible: 30,
    costoUnitario: 12,
  });

  beforeEach(() => {
    alertaRepositoryMock = {
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

    useCase = new ConfigurarAlertaUseCase(
      alertaRepositoryMock,
      proyectoRepositoryMock,
      tareaRepositoryMock,
      materialRepositoryMock,
    );
  });

  it('configura alerta correctamente con proyecto existente', async () => {
    const dto: ConfigurarAlertaDto = {
      idProyecto: 5,
      criterioActivacion: 'Desviación mayor al 10%',
      tipoAlerta: TipoAlerta.DESVIACION_CRONOGRAMA,
      metodoNotificacion: MetodoNotificacion.SISTEMA,
      mensajeNotificacion: 'Proyecto con desviación crítica',
    };

    const alertaCreada = new Alerta({
      idAlerta: 1,
      ...dto,
      estadoAlerta: EstadoAlerta.ACTIVA,
      fechaGeneracion: new Date(),
    });

    proyectoRepositoryMock.findById.mockResolvedValue(proyectoExistente);
    alertaRepositoryMock.create.mockResolvedValue(alertaCreada);

    const result = await useCase.execute(dto);

    expect(alertaRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idProyecto: dto.idProyecto,
        criterioActivacion: dto.criterioActivacion,
        tipoAlerta: dto.tipoAlerta,
        metodoNotificacion: dto.metodoNotificacion,
        mensajeNotificacion: dto.mensajeNotificacion,
        estadoAlerta: EstadoAlerta.ACTIVA,
      }),
    );
    expect(result).toBe(alertaCreada);
  });

  it('configura alerta correctamente con tarea existente', async () => {
    const dto: ConfigurarAlertaDto = {
      idTarea: 9,
      criterioActivacion: 'Tarea atrasada',
      tipoAlerta: TipoAlerta.RETRASO_TAREA,
    };

    const alertaCreada = new Alerta({
      idAlerta: 2,
      ...dto,
      estadoAlerta: EstadoAlerta.ACTIVA,
      fechaGeneracion: new Date(),
    });

    tareaRepositoryMock.findById.mockResolvedValue(tareaExistente);
    alertaRepositoryMock.create.mockResolvedValue(alertaCreada);

    const result = await useCase.execute(dto);

    expect(result).toBe(alertaCreada);
  });

  it('configura alerta correctamente con material existente', async () => {
    const dto: ConfigurarAlertaDto = {
      idMaterial: 11,
      criterioActivacion: 'Stock bajo',
      tipoAlerta: TipoAlerta.MATERIAL_BAJO,
    };

    const alertaCreada = new Alerta({
      idAlerta: 3,
      ...dto,
      estadoAlerta: EstadoAlerta.ACTIVA,
      fechaGeneracion: new Date(),
    });

    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    alertaRepositoryMock.create.mockResolvedValue(alertaCreada);

    const result = await useCase.execute(dto);

    expect(result).toBe(alertaCreada);
  });

  it('lanza BadRequestException si no viene idProyecto, idTarea ni idMaterial', async () => {
    await expect(
      useCase.execute({
        criterioActivacion: 'Sin destino',
        tipoAlerta: TipoAlerta.PLAZO_CRITICO,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lanza NotFoundException si proyecto no existe', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idProyecto: 999,
        criterioActivacion: 'Proyecto faltante',
        tipoAlerta: TipoAlerta.PLAZO_CRITICO,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza NotFoundException si tarea no existe', async () => {
    tareaRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idTarea: 999,
        criterioActivacion: 'Tarea faltante',
        tipoAlerta: TipoAlerta.RETRASO_TAREA,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza NotFoundException si material no existe', async () => {
    materialRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idMaterial: 999,
        criterioActivacion: 'Material faltante',
        tipoAlerta: TipoAlerta.MATERIAL_BAJO,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
