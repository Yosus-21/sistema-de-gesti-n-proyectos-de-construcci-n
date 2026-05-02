import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Material, TipoMaterial } from '../../../../domain';
import type { MaterialRepository } from '../../../../infrastructure';
import { VerificarDisponibilidadMaterialDto } from '../../dto';
import { VerificarDisponibilidadMaterialUseCase } from '../verificar-disponibilidad-material.usecase';

describe('VerificarDisponibilidadMaterialUseCase', () => {
  let useCase: VerificarDisponibilidadMaterialUseCase;
  let materialRepositoryMock: jest.Mocked<MaterialRepository>;

  const materialExistente = new Material({
    idMaterial: 27,
    nombre: 'Ceramica',
    descripcion: 'Material de acabado',
    tipoMaterial: TipoMaterial.OBRA_FINA,
    unidad: 'caja',
    cantidadDisponible: 14,
    costoUnitario: 110,
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

    useCase = new VerificarDisponibilidadMaterialUseCase(
      materialRepositoryMock,
    );
  });

  it('retorna disponible true si hay stock suficiente', async () => {
    const dto: VerificarDisponibilidadMaterialDto = {
      idMaterial: 27,
      cantidadRequerida: 10,
    };

    materialRepositoryMock.findById.mockResolvedValue(materialExistente);

    const result = await useCase.execute(dto);

    expect(result).toEqual({
      idMaterial: dto.idMaterial,
      cantidadDisponible: materialExistente.cantidadDisponible,
      cantidadRequerida: dto.cantidadRequerida,
      disponible: true,
    });
  });

  it('retorna disponible false si no hay stock suficiente', async () => {
    const dto: VerificarDisponibilidadMaterialDto = {
      idMaterial: 27,
      cantidadRequerida: 20,
    };

    materialRepositoryMock.findById.mockResolvedValue(materialExistente);

    const result = await useCase.execute(dto);

    expect(result).toEqual({
      idMaterial: dto.idMaterial,
      cantidadDisponible: materialExistente.cantidadDisponible,
      cantidadRequerida: dto.cantidadRequerida,
      disponible: false,
    });
  });

  it('lanza NotFoundException si material no existe', async () => {
    materialRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idMaterial: 500,
        cantidadRequerida: 2,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza BadRequestException si cantidadRequerida es negativa', async () => {
    materialRepositoryMock.findById.mockResolvedValue(materialExistente);

    await expect(
      useCase.execute({
        idMaterial: materialExistente.idMaterial!,
        cantidadRequerida: -1,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
