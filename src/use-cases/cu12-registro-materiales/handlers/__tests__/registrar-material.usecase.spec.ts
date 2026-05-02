import { BadRequestException, ConflictException } from '@nestjs/common';
import { Material, TipoMaterial } from '../../../../domain';
import type { MaterialRepository } from '../../../../infrastructure';
import { RegistrarMaterialDto } from '../../dto';
import { RegistrarMaterialUseCase } from '../registrar-material.usecase';

describe('RegistrarMaterialUseCase', () => {
  let useCase: RegistrarMaterialUseCase;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const dtoBase: RegistrarMaterialDto = {
    nombre: 'Material base',
    descripcion: 'Material de prueba',
    tipoMaterial: TipoMaterial.GENERAL,
    unidad: 'bolsa',
    cantidadDisponible: 20,
    costoUnitario: 35.5,
    especificacionesTecnicas: 'Especificaciones base',
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

    useCase = new RegistrarMaterialUseCase(materialRepositoryMock);
  });

  it('registra material correctamente', async () => {
    const materialCreado = new Material({
      idMaterial: 15,
      ...dtoBase,
    });

    materialRepositoryMock.existsByNombre.mockResolvedValue(false);
    materialRepositoryMock.create.mockResolvedValue(materialCreado);

    const result = await useCase.execute(dtoBase);

    expect(materialRepositoryMock.existsByNombre).toHaveBeenCalledWith(
      dtoBase.nombre,
    );
    expect(materialRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: dtoBase.nombre,
        descripcion: dtoBase.descripcion,
        tipoMaterial: dtoBase.tipoMaterial,
        unidad: dtoBase.unidad,
        cantidadDisponible: dtoBase.cantidadDisponible,
        costoUnitario: dtoBase.costoUnitario,
      }),
    );
    expect(result).toBe(materialCreado);
  });

  it('lanza ConflictException si ya existe material con el mismo nombre', async () => {
    materialRepositoryMock.existsByNombre.mockResolvedValue(true);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(materialRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('lanza BadRequestException si cantidadDisponible o costoUnitario son negativos', async () => {
    materialRepositoryMock.existsByNombre.mockResolvedValue(false);

    await expect(
      useCase.execute({
        ...dtoBase,
        cantidadDisponible: -1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    await expect(
      useCase.execute({
        ...dtoBase,
        costoUnitario: -5,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);

    expect(materialRepositoryMock.create).not.toHaveBeenCalled();
  });
});
