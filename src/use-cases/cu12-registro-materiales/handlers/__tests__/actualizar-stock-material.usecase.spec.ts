import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Material, TipoMaterial } from '../../../../domain';
import type { MaterialRepository } from '../../../../infrastructure';
import { ActualizarStockMaterialDto } from '../../dto';
import { ActualizarStockMaterialUseCase } from '../actualizar-stock-material.usecase';

describe('ActualizarStockMaterialUseCase', () => {
  let useCase: ActualizarStockMaterialUseCase;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const materialExistente = new Material({
    idMaterial: 19,
    nombre: 'Yeso',
    descripcion: 'Material de acabado',
    tipoMaterial: TipoMaterial.OBRA_FINA,
    unidad: 'bolsa',
    cantidadDisponible: 25,
    costoUnitario: 50,
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

    useCase = new ActualizarStockMaterialUseCase(materialRepositoryMock);
  });

  it('aumenta stock con cantidad positiva', async () => {
    const dto: ActualizarStockMaterialDto = {
      idMaterial: 19,
      cantidad: 5,
      motivo: 'Ingreso de almacen',
    };

    const materialActualizado = new Material({
      ...materialExistente,
      cantidadDisponible: 30,
    });

    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    materialRepositoryMock.update.mockResolvedValue(materialActualizado);

    const result = await useCase.execute(dto);

    expect(materialRepositoryMock.update).toHaveBeenCalledWith(dto.idMaterial, {
      cantidadDisponible: 30,
    });
    expect(result).toBe(materialActualizado);
  });

  it('disminuye stock con cantidad negativa', async () => {
    const dto: ActualizarStockMaterialDto = {
      idMaterial: 19,
      cantidad: -7,
      motivo: 'Consumo en obra',
    };

    const materialActualizado = new Material({
      ...materialExistente,
      cantidadDisponible: 18,
    });

    materialRepositoryMock.findById.mockResolvedValue(materialExistente);
    materialRepositoryMock.update.mockResolvedValue(materialActualizado);

    const result = await useCase.execute(dto);

    expect(materialRepositoryMock.update).toHaveBeenCalledWith(dto.idMaterial, {
      cantidadDisponible: 18,
    });
    expect(result).toBe(materialActualizado);
  });

  it('lanza NotFoundException si material no existe', async () => {
    materialRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idMaterial: 99,
        cantidad: 3,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza BadRequestException si el stock resultante seria negativo', async () => {
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);

    await expect(
      useCase.execute({
        idMaterial: materialExistente.idMaterial!,
        cantidad: -40,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(materialRepositoryMock.update).not.toHaveBeenCalled();
  });
});
