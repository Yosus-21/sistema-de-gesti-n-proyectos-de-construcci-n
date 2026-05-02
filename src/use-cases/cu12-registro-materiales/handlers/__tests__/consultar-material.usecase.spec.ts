import { NotFoundException } from '@nestjs/common';
import { Material, TipoMaterial } from '../../../../domain';
import type { MaterialRepository } from '../../../../infrastructure';
import { ConsultarMaterialDto } from '../../dto';
import { ConsultarMaterialUseCase } from '../consultar-material.usecase';

describe('ConsultarMaterialUseCase', () => {
  let useCase: ConsultarMaterialUseCase;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const dtoBase: ConsultarMaterialDto = {
    idMaterial: 21,
  };

  const materialExistente = new Material({
    idMaterial: 21,
    nombre: 'Pintura blanca',
    descripcion: 'Material de acabado',
    tipoMaterial: TipoMaterial.OBRA_FINA,
    unidad: 'lata',
    cantidadDisponible: 12,
    costoUnitario: 120,
  });

  beforeEach(() => {
    materialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByNombre: jest.fn(),
      existsByNombreExcludingId: jest.fn(),
    };

    useCase = new ConsultarMaterialUseCase(materialRepositoryMock);
  });

  it('retorna material existente', async () => {
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);

    const result = await useCase.execute(dtoBase);

    expect(materialRepositoryMock.findById).toHaveBeenCalledWith(
      dtoBase.idMaterial,
    );
    expect(result).toBe(materialExistente);
  });

  it('lanza NotFoundException si no existe', async () => {
    materialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
