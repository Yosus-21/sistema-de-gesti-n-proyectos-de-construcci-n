import { NotFoundException } from '@nestjs/common';
import { PronosticoMaterial } from '../../../../domain';
import type { PronosticoMaterialRepository } from '../../../../infrastructure';
import { ConfirmarPronosticoMaterialDto } from '../../dto';
import { ConfirmarPronosticoMaterialUseCase } from '../confirmar-pronostico-material.usecase';

describe('ConfirmarPronosticoMaterialUseCase', () => {
  let useCase: ConfirmarPronosticoMaterialUseCase;
  let pronosticoMaterialRepositoryMock: jest.Mocked<PronosticoMaterialRepository>;

  const dtoBase: ConfirmarPronosticoMaterialDto = {
    idPronosticoMaterial: 31,
  };

  const pronosticoExistente = new PronosticoMaterial({
    idPronosticoMaterial: 31,
    idProyecto: 4,
    periodoAnalisis: '2026-Q4',
    stockMinimo: 5,
    stockMaximo: 14,
    fechaGeneracion: new Date('2026-10-10T00:00:00.000Z'),
    nivelConfianza: 80,
    observaciones: 'Heurística inicial.',
  });

  beforeEach(() => {
    pronosticoMaterialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ConfirmarPronosticoMaterialUseCase(
      pronosticoMaterialRepositoryMock,
    );
  });

  it('confirma pronóstico actualizando observaciones', async () => {
    const pronosticoConfirmado = new PronosticoMaterial({
      ...pronosticoExistente,
      observaciones:
        'Heurística inicial. Pronóstico confirmado para planificación de compras.',
    });

    pronosticoMaterialRepositoryMock.findById.mockResolvedValue(
      pronosticoExistente,
    );
    pronosticoMaterialRepositoryMock.update.mockResolvedValue(
      pronosticoConfirmado,
    );

    const result = await useCase.execute(dtoBase);

    expect(pronosticoMaterialRepositoryMock.update).toHaveBeenCalledWith(
      dtoBase.idPronosticoMaterial,
      {
        observaciones:
          'Heurística inicial. Pronóstico confirmado para planificación de compras.',
      },
    );
    expect(result).toBe(pronosticoConfirmado);
  });

  it('lanza NotFoundException si no existe', async () => {
    pronosticoMaterialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
