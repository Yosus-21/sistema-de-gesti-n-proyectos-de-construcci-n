import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PronosticoMaterial } from '../../../../domain';
import type { PronosticoMaterialRepository } from '../../../../infrastructure';
import { AjustarPronosticoMaterialDto } from '../../dto';
import { AjustarPronosticoMaterialUseCase } from '../ajustar-pronostico-material.usecase';

describe('AjustarPronosticoMaterialUseCase', () => {
  let useCase: AjustarPronosticoMaterialUseCase;
  let pronosticoMaterialRepositoryMock: jest.Mocked<PronosticoMaterialRepository>;

  const dtoBase: AjustarPronosticoMaterialDto = {
    idPronosticoMaterial: 21,
    stockMinimo: 8,
    stockMaximo: 18,
    observaciones: 'Ajuste manual',
  };

  const pronosticoExistente = new PronosticoMaterial({
    idPronosticoMaterial: 21,
    idProyecto: 5,
    periodoAnalisis: '2026-Q4',
    stockMinimo: 10,
    stockMaximo: 20,
    fechaGeneracion: new Date('2026-10-10T00:00:00.000Z'),
    nivelConfianza: 70,
    observaciones: 'Base',
  });

  beforeEach(() => {
    pronosticoMaterialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new AjustarPronosticoMaterialUseCase(
      pronosticoMaterialRepositoryMock,
    );
  });

  it('ajusta pronóstico correctamente', async () => {
    const pronosticoActualizado = new PronosticoMaterial({
      ...pronosticoExistente,
      stockMinimo: dtoBase.stockMinimo,
      stockMaximo: dtoBase.stockMaximo,
      observaciones: dtoBase.observaciones,
      nivelConfianza: 80,
    });

    pronosticoMaterialRepositoryMock.findById.mockResolvedValue(
      pronosticoExistente,
    );
    pronosticoMaterialRepositoryMock.update.mockResolvedValue(
      pronosticoActualizado,
    );

    const result = await useCase.execute(dtoBase);

    expect(pronosticoMaterialRepositoryMock.update).toHaveBeenCalledWith(
      dtoBase.idPronosticoMaterial,
      {
        stockMinimo: dtoBase.stockMinimo,
        stockMaximo: dtoBase.stockMaximo,
        observaciones: dtoBase.observaciones,
        nivelConfianza: 80,
      },
    );
    expect(result).toBe(pronosticoActualizado);
  });

  it('lanza NotFoundException si no existe', async () => {
    pronosticoMaterialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza BadRequestException si stockMinimo o stockMaximo son negativos', async () => {
    pronosticoMaterialRepositoryMock.findById.mockResolvedValue(
      pronosticoExistente,
    );

    await expect(
      useCase.execute({
        ...dtoBase,
        stockMinimo: -5,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('lanza BadRequestException si stockMaximo final < stockMinimo final', async () => {
    pronosticoMaterialRepositoryMock.findById.mockResolvedValue(
      pronosticoExistente,
    );

    await expect(
      useCase.execute({
        ...dtoBase,
        stockMinimo: 25,
        stockMaximo: 15,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
