/* eslint-disable @typescript-eslint/unbound-method */
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EstadoProyecto,
  Material,
  PronosticoMaterial,
  Proyecto,
  TipoMaterial,
} from '../../../../domain';
import type {
  MaterialRepository,
  PronosticoMaterialRepository,
  ProyectoRepository,
  AiMaterialForecastPort,
} from '../../../../infrastructure';
import { GenerarPronosticoMaterialDto } from '../../dto';
import { GenerarPronosticoMaterialUseCase } from '../generar-pronostico-material.usecase';

describe('GenerarPronosticoMaterialUseCase', () => {
  let useCase: GenerarPronosticoMaterialUseCase;
  let pronosticoMaterialRepositoryMock: jest.Mocked<PronosticoMaterialRepository>;
  let proyectoRepositoryMock: jest.Mocked<ProyectoRepository>;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;
  let aiMaterialForecastPortMock: jest.Mocked<AiMaterialForecastPort>;

  const dtoBase: GenerarPronosticoMaterialDto = {
    idProyecto: 5,
    periodoAnalisis: '2026-Q4',
    stockMinimo: 10,
    stockMaximo: 20,
  };

  const proyectoExistente = new Proyecto({
    idProyecto: 5,
    nombre: 'Proyecto CU17',
    descripcion: 'Proyecto de prueba',
    ubicacion: 'Sucre',
    presupuesto: 150000,
    fechaInicio: new Date('2026-10-01T00:00:00.000Z'),
    fechaFinEstimada: new Date('2027-01-01T00:00:00.000Z'),
    estadoProyecto: EstadoProyecto.PLANIFICACION,
    especificacionesTecnicas: 'Specs CU17',
  });

  const materialExistente = new Material({
    idMaterial: 9,
    nombre: 'Acero',
    descripcion: 'Material de prueba',
    tipoMaterial: TipoMaterial.OBRA_BRUTA,
    unidad: 'barra',
    cantidadDisponible: 15,
    costoUnitario: 18,
  });

  beforeEach(() => {
    pronosticoMaterialRepositoryMock = {
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

    materialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByNombre: jest.fn(),
      existsByNombreExcludingId: jest.fn(),
    };

    aiMaterialForecastPortMock = {
      generateMaterialForecast: jest.fn(),
    };

    useCase = new GenerarPronosticoMaterialUseCase(
      pronosticoMaterialRepositoryMock,
      proyectoRepositoryMock,
      materialRepositoryMock,
      aiMaterialForecastPortMock,
    );
  });

  it('genera pronóstico correctamente si proyecto existe', async () => {
    const pronosticoCreado = new PronosticoMaterial({
      idPronosticoMaterial: 12,
      idProyecto: dtoBase.idProyecto,
      periodoAnalisis: dtoBase.periodoAnalisis,
      stockMinimo: dtoBase.stockMinimo,
      stockMaximo: dtoBase.stockMaximo,
      fechaGeneracion: new Date(),
      nivelConfianza: 70,
      observaciones:
        'Pronóstico generado con heurística provisional de IA para planificación de materiales.',
    });

    proyectoRepositoryMock.findById.mockResolvedValue(proyectoExistente);
    aiMaterialForecastPortMock.generateMaterialForecast.mockResolvedValue({
      stockMinimo: dtoBase.stockMinimo,
      stockMaximo: dtoBase.stockMaximo,
      nivelConfianza: 70,
      riesgo: 'MEDIO',
      justificacion: 'Pronóstico heurístico',
      provider: 'heuristic',
    });
    pronosticoMaterialRepositoryMock.create.mockResolvedValue(pronosticoCreado);

    const result = await useCase.execute(dtoBase);

    expect(
      aiMaterialForecastPortMock.generateMaterialForecast,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        idProyecto: dtoBase.idProyecto,
      }),
    );
    expect(pronosticoMaterialRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idProyecto: dtoBase.idProyecto,
        periodoAnalisis: dtoBase.periodoAnalisis,
        stockMinimo: dtoBase.stockMinimo,
        stockMaximo: dtoBase.stockMaximo,
        nivelConfianza: 70,
        observaciones: 'Pronóstico heurístico',
      }),
    );
    expect(result).toBe(pronosticoCreado);
  });

  it('genera pronóstico correctamente con material existente', async () => {
    const pronosticoCreado = new PronosticoMaterial({
      idPronosticoMaterial: 13,
      idProyecto: dtoBase.idProyecto,
      idMaterial: materialExistente.idMaterial,
      periodoAnalisis: dtoBase.periodoAnalisis,
      stockMinimo: dtoBase.stockMinimo,
      stockMaximo: dtoBase.stockMaximo,
      fechaGeneracion: new Date(),
      nivelConfianza: 85,
      observaciones: 'Observación manual',
    });

    proyectoRepositoryMock.findById.mockResolvedValue(proyectoExistente);
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    aiMaterialForecastPortMock.generateMaterialForecast.mockResolvedValue({
      stockMinimo: dtoBase.stockMinimo,
      stockMaximo: dtoBase.stockMaximo,
      nivelConfianza: 85,
      riesgo: 'BAJO',
      justificacion: 'Stock suficiente',
      provider: 'google-gemini',
    });
    pronosticoMaterialRepositoryMock.create.mockResolvedValue(pronosticoCreado);

    const result = await useCase.execute({
      ...dtoBase,
      idMaterial: materialExistente.idMaterial,
      observaciones: 'Observación manual',
    });

    expect(materialRepositoryMock.findById).toHaveBeenCalledWith(
      materialExistente.idMaterial,
    );
    expect(
      aiMaterialForecastPortMock.generateMaterialForecast,
    ).toHaveBeenCalled();
    expect(pronosticoMaterialRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        idMaterial: materialExistente.idMaterial,
        nivelConfianza: 85,
        observaciones: 'Observación manual | Stock suficiente',
      }),
    );
    expect(result).toBe(pronosticoCreado);
  });

  it('lanza NotFoundException si proyecto no existe', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza NotFoundException si material no existe', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(proyectoExistente);
    materialRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        ...dtoBase,
        idMaterial: 999,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza BadRequestException si stockMinimo o stockMaximo son negativos', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(proyectoExistente);

    await expect(
      useCase.execute({
        ...dtoBase,
        stockMinimo: -1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lanza BadRequestException si stockMaximo < stockMinimo', async () => {
    proyectoRepositoryMock.findById.mockResolvedValue(proyectoExistente);

    await expect(
      useCase.execute({
        ...dtoBase,
        stockMinimo: 12,
        stockMaximo: 6,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
