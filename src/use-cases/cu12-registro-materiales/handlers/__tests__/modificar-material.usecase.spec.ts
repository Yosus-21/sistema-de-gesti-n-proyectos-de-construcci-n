import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Material, TipoMaterial } from '../../../../domain';
import type { MaterialRepository } from '../../../../infrastructure';
import { ModificarMaterialDto } from '../../dto';
import { ModificarMaterialUseCase } from '../modificar-material.usecase';

describe('ModificarMaterialUseCase', () => {
  let useCase: ModificarMaterialUseCase;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const materialExistente = new Material({
    idMaterial: 7,
    nombre: 'Cemento Portland',
    descripcion: 'Material base',
    tipoMaterial: TipoMaterial.OBRA_BRUTA,
    unidad: 'bolsa',
    cantidadDisponible: 30,
    costoUnitario: 45,
    especificacionesTecnicas: 'Resistencia tipo I',
  });

  const dtoBase: ModificarMaterialDto = {
    idMaterial: 7,
    nombre: 'Cemento Portland Premium',
    descripcion: 'Material actualizado',
    tipoMaterial: TipoMaterial.OBRA_BRUTA,
    unidad: 'bolsa',
    cantidadDisponible: 35,
    costoUnitario: 47.5,
    especificacionesTecnicas: 'Resistencia tipo II',
  };

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

    useCase = new ModificarMaterialUseCase(materialRepositoryMock);
  });

  it('modifica material existente', async () => {
    const materialActualizado = new Material({
      ...materialExistente,
      ...dtoBase,
    });

    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    materialRepositoryMock.existsByNombreExcludingId.mockResolvedValue(false);
    materialRepositoryMock.update.mockResolvedValue(materialActualizado);

    const result = await useCase.execute(dtoBase);

    expect(materialRepositoryMock.findById).toHaveBeenCalledWith(
      dtoBase.idMaterial,
    );
    expect(
      materialRepositoryMock.existsByNombreExcludingId,
    ).toHaveBeenCalledWith(dtoBase.nombre!, dtoBase.idMaterial);
    expect(materialRepositoryMock.update).toHaveBeenCalledWith(
      dtoBase.idMaterial,
      {
        nombre: dtoBase.nombre,
        descripcion: dtoBase.descripcion,
        tipoMaterial: dtoBase.tipoMaterial,
        unidad: dtoBase.unidad,
        cantidadDisponible: dtoBase.cantidadDisponible,
        costoUnitario: dtoBase.costoUnitario,
        especificacionesTecnicas: dtoBase.especificacionesTecnicas,
      },
    );
    expect(result).toBe(materialActualizado);
  });

  it('lanza NotFoundException si no existe', async () => {
    materialRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(materialRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('lanza ConflictException si nombre pertenece a otro material', async () => {
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    materialRepositoryMock.existsByNombreExcludingId.mockResolvedValue(true);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(materialRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si cantidadDisponible o costoUnitario quedan negativos', async () => {
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    materialRepositoryMock.existsByNombreExcludingId.mockResolvedValue(false);

    await expect(
      useCase.execute({
        idMaterial: materialExistente.idMaterial!,
        cantidadDisponible: -2,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      useCase.execute({
        idMaterial: materialExistente.idMaterial!,
        costoUnitario: -1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(materialRepositoryMock.update).not.toHaveBeenCalled();
  });
});
