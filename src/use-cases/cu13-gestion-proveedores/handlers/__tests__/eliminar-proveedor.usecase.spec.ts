import { NotFoundException } from '@nestjs/common';
import { Proveedor } from '../../../../domain';
import type { ProveedorRepository } from '../../../../infrastructure';
import { EliminarProveedorDto } from '../../dto';
import { EliminarProveedorUseCase } from '../eliminar-proveedor.usecase';

describe('EliminarProveedorUseCase', () => {
  let useCase: EliminarProveedorUseCase;
  let proveedorRepositoryMock: jest.Mocked<ProveedorRepository>;

  const dtoBase: EliminarProveedorDto = {
    idProveedor: 4,
  };

  const proveedorExistente = new Proveedor({
    idProveedor: 4,
    nombre: 'Proveedor Eliminable',
    direccion: 'Zona Sur',
    telefono: '70000010',
    correo: 'eliminar@example.com',
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

    useCase = new EliminarProveedorUseCase(proveedorRepositoryMock);
  });

  it('elimina proveedor existente', async () => {
    proveedorRepositoryMock.findById.mockResolvedValue(proveedorExistente);
    proveedorRepositoryMock.delete.mockResolvedValue();

    const result = await useCase.execute(dtoBase);

    expect(proveedorRepositoryMock.delete).toHaveBeenCalledWith(
      dtoBase.idProveedor,
    );
    expect(result).toEqual({
      eliminado: true,
      idProveedor: dtoBase.idProveedor,
    });
  });

  it('lanza NotFoundException si no existe', async () => {
    proveedorRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(proveedorRepositoryMock.delete).not.toHaveBeenCalled();
  });
});
