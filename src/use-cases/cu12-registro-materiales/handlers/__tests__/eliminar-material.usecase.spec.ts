import { NotFoundException } from '@nestjs/common';
import { Material, TipoMaterial } from '../../../../domain';
import type { MaterialRepository } from '../../../../infrastructure';
import { EliminarMaterialDto } from '../../dto';
import { EliminarMaterialUseCase } from '../eliminar-material.usecase';

describe('EliminarMaterialUseCase', () => {
  let useCase: EliminarMaterialUseCase;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const dtoBase: EliminarMaterialDto = {
    idMaterial: 11,
  };

  const materialExistente = new Material({
    idMaterial: 11,
    nombre: 'Arena fina',
    descripcion: 'Material de prueba',
    tipoMaterial: TipoMaterial.OBRA_BRUTA,
    unidad: 'm3',
    cantidadDisponible: 18,
    costoUnitario: 90,
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

    useCase = new EliminarMaterialUseCase(materialRepositoryMock);
  });

  it('elimina material existente', async () => {
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    materialRepositoryMock.delete.mockResolvedValue();

    const result = await useCase.execute(dtoBase);

    expect(materialRepositoryMock.delete).toHaveBeenCalledWith(
      dtoBase.idMaterial,
    );
    expect(result).toEqual({
      eliminado: true,
      idMaterial: dtoBase.idMaterial,
    });
  });

  it('lanza NotFoundException si no existe', async () => {
    materialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(materialRepositoryMock.delete).not.toHaveBeenCalled();
  });
});
