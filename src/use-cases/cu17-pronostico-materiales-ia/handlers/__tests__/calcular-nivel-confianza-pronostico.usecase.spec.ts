import { NotFoundException } from '@nestjs/common';
import { Material, PronosticoMaterial, TipoMaterial } from '../../../../domain';
import type {
  MaterialRepository,
  PronosticoMaterialRepository,
} from '../../../../infrastructure';
import { CalcularNivelConfianzaPronosticoDto } from '../../dto';
import { CalcularNivelConfianzaPronosticoUseCase } from '../calcular-nivel-confianza-pronostico.usecase';

describe('CalcularNivelConfianzaPronosticoUseCase', () => {
  let useCase: CalcularNivelConfianzaPronosticoUseCase;
  let pronosticoMaterialRepositoryMock: jest.Mocked<PronosticoMaterialRepository>;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const dtoBase: CalcularNivelConfianzaPronosticoDto = {
    idPronosticoMaterial: 41,
  };

  const pronosticoExistente = new PronosticoMaterial({
    idPronosticoMaterial: 41,
    idProyecto: 3,
    idMaterial: 10,
    periodoAnalisis: '2026-Q4',
    stockMinimo: 10,
    stockMaximo: 20,
    fechaGeneracion: new Date('2026-10-10T00:00:00.000Z'),
    nivelConfianza: 70,
  });

  beforeEach(() => {
    pronosticoMaterialRepositoryMock = {
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

    useCase = new CalcularNivelConfianzaPronosticoUseCase(
      pronosticoMaterialRepositoryMock,
      materialRepositoryMock,
    );
  });

  it('calcula confianza 85 si stock está dentro del rango', async () => {
    pronosticoMaterialRepositoryMock.findById.mockResolvedValue(
      pronosticoExistente,
    );
    materialRepositoryMock.findById.mockResolvedValue(
      new Material({
        idMaterial: 10,
        nombre: 'Cemento',
        descripcion: 'Material',
        tipoMaterial: TipoMaterial.GENERAL,
        unidad: 'bolsa',
        cantidadDisponible: 15,
        costoUnitario: 10,
      }),
    );

    const result = await useCase.execute(dtoBase);

    expect(pronosticoMaterialRepositoryMock.update).toHaveBeenCalledWith(
      dtoBase.idPronosticoMaterial,
      {
        nivelConfianza: 85,
      },
    );
    expect(result).toEqual({
      idPronosticoMaterial: dtoBase.idPronosticoMaterial,
      nivelConfianza: 85,
      mensaje: 'Nivel de confianza calculado con heurística provisional.',
    });
  });

  it('calcula confianza 60 si stock está por debajo del mínimo', async () => {
    pronosticoMaterialRepositoryMock.findById.mockResolvedValue(
      pronosticoExistente,
    );
    materialRepositoryMock.findById.mockResolvedValue(
      new Material({
        idMaterial: 10,
        nombre: 'Cemento',
        descripcion: 'Material',
        tipoMaterial: TipoMaterial.GENERAL,
        unidad: 'bolsa',
        cantidadDisponible: 5,
        costoUnitario: 10,
      }),
    );

    const result = await useCase.execute(dtoBase);

    expect(result.nivelConfianza).toBe(60);
  });

  it('calcula confianza 75 si stock está por encima del máximo', async () => {
    pronosticoMaterialRepositoryMock.findById.mockResolvedValue(
      pronosticoExistente,
    );
    materialRepositoryMock.findById.mockResolvedValue(
      new Material({
        idMaterial: 10,
        nombre: 'Cemento',
        descripcion: 'Material',
        tipoMaterial: TipoMaterial.GENERAL,
        unidad: 'bolsa',
        cantidadDisponible: 30,
        costoUnitario: 10,
      }),
    );

    const result = await useCase.execute(dtoBase);

    expect(result.nivelConfianza).toBe(75);
  });

  it('lanza NotFoundException si pronóstico no existe', async () => {
    pronosticoMaterialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza NotFoundException si material asociado no existe', async () => {
    pronosticoMaterialRepositoryMock.findById.mockResolvedValue(
      pronosticoExistente,
    );
    materialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
