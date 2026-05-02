import { ConflictException, NotFoundException } from '@nestjs/common';
import {
  Cronograma,
  EstadoCronograma,
  EstadoProyecto,
  Proyecto,
} from '../../../../domain';
import type {
  CronogramaRepository,
  ProyectoRepository,
} from '../../../../infrastructure';
import { CrearCronogramaDto } from '../../dto';
import { CrearCronogramaUseCase } from '../crear-cronograma.usecase';
import { expectAnyDate } from '../../../../test-utils/typed-matchers';

describe('CrearCronogramaUseCase', () => {
  let useCase: CrearCronogramaUseCase;
  let cronogramaRepositoryMock: jest.Mocked<CronogramaRepository>;
  let proyectoRepositoryMock: jest.Mocked<ProyectoRepository>;

  const crearCronogramaDto: CrearCronogramaDto = {
    idProyecto: 11,
    nombre: 'Cronograma Base',
    estadoInicial: EstadoCronograma.PLANIFICADO,
    accionesAnteRetraso: 'Revisar hitos criticos',
  };

  beforeEach(() => {
    cronogramaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findByProyecto: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByProyecto: jest.fn(),
    };

    proyectoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsActiveByCliente: jest.fn(),
    };

    useCase = new CrearCronogramaUseCase(
      cronogramaRepositoryMock,
      proyectoRepositoryMock,
    );
  });

  it('crea cronograma correctamente si proyecto existe y no tiene cronograma', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(
      new Proyecto({
        idProyecto: 11,
        idCliente: 2,
        nombre: 'Proyecto Base',
        descripcion: 'Descripcion',
        ubicacion: 'La Paz',
        presupuesto: 100000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-08-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs',
      }),
    );
    cronogramaRepositoryMock.existsByProyecto.mockResolvedValue(false);

    const cronogramaCreado = new Cronograma({
      idCronograma: 30,
      idProyecto: 11,
      nombre: 'Cronograma Base',
      fechaCreacion: new Date(),
      estadoCronograma: EstadoCronograma.PLANIFICADO,
      accionesAnteRetraso: 'Revisar hitos criticos',
    });

    cronogramaRepositoryMock.create.mockResolvedValue(cronogramaCreado);

    const result = await useCase.execute(crearCronogramaDto);

    expect(proyectoRepositoryMock.findById).toHaveBeenCalledWith(11);
    expect(cronogramaRepositoryMock.existsByProyecto).toHaveBeenCalledWith(11);
    expect(cronogramaRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idProyecto: 11,
        nombre: 'Cronograma Base',
        estadoCronograma: EstadoCronograma.PLANIFICADO,
        accionesAnteRetraso: 'Revisar hitos criticos',
        fechaCreacion: expectAnyDate(),
      }),
    );
    expect(result).toBe(cronogramaCreado);
  });

  it('lanza NotFoundException si proyecto no existe', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(crearCronogramaDto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(cronogramaRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('lanza ConflictException si el proyecto ya tiene cronograma', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(
      new Proyecto({
        idProyecto: 11,
        idCliente: 2,
        nombre: 'Proyecto Base',
        descripcion: 'Descripcion',
        ubicacion: 'La Paz',
        presupuesto: 100000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-08-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs',
      }),
    );
    cronogramaRepositoryMock.existsByProyecto.mockResolvedValue(true);

    await expect(useCase.execute(crearCronogramaDto)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(cronogramaRepositoryMock.create).not.toHaveBeenCalled();
  });
});
