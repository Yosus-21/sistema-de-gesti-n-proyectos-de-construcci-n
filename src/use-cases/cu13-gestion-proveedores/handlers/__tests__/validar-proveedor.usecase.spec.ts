import { NotFoundException } from '@nestjs/common';
import { Proveedor } from '../../../../domain';
import type { ProveedorRepository } from '../../../../infrastructure';
import { ValidarProveedorDto } from '../../dto';
import { ValidarProveedorUseCase } from '../validar-proveedor.usecase';

describe('ValidarProveedorUseCase', () => {
  let useCase: ValidarProveedorUseCase;
  let proveedorRepositoryMock: jest.Mocked<ProveedorRepository>;

  const dtoBase: ValidarProveedorDto = {
    idProveedor: 12,
  };

  const proveedorExistente = new Proveedor({
    idProveedor: 12,
    nombre: 'Proveedor Valido',
    direccion: 'Zona Centro',
    telefono: '70000030',
    correo: 'valido@example.com',
  });

  beforeEach(() => {
    proveedorRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByNombreOrCorreo: jest.fn(),
      existsByNombreOrCorreoExcludingId: jest.fn(),
    };

    useCase = new ValidarProveedorUseCase(proveedorRepositoryMock);
  });

  it('retorna valido true si proveedor existe', async () => {
    proveedorRepositoryMock.findById.mockResolvedValue(proveedorExistente);

    const result = await useCase.execute(dtoBase);

    expect(result).toEqual({
      idProveedor: dtoBase.idProveedor,
      valido: true,
      mensaje: 'Proveedor registrado y disponible para órdenes de compra.',
    });
  });

  it('lanza NotFoundException si proveedor no existe', async () => {
    proveedorRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
