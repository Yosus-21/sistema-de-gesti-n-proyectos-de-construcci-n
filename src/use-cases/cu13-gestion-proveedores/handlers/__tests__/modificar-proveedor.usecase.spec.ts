import { ConflictException, NotFoundException } from '@nestjs/common';
import { Proveedor } from '../../../../domain';
import type { ProveedorRepository } from '../../../../infrastructure';
import { ModificarProveedorDto } from '../../dto';
import { ModificarProveedorUseCase } from '../modificar-proveedor.usecase';

describe('ModificarProveedorUseCase', () => {
  let useCase: ModificarProveedorUseCase;
  let proveedorRepositoryMock: jest.Mocked<ProveedorRepository>;

  const proveedorExistente = new Proveedor({
    idProveedor: 8,
    nombre: 'Proveedor Inicial',
    direccion: 'Calle 1',
    telefono: '70000001',
    correo: 'proveedor-inicial@example.com',
    terminosEntrega: '72 horas',
  });

  const dtoBase: ModificarProveedorDto = {
    idProveedor: 8,
    nombre: 'Proveedor Actualizado',
    direccion: 'Calle 2',
    telefono: '70000002',
    correo: 'proveedor-actualizado@example.com',
    terminosEntrega: '24 horas',
  };

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

    useCase = new ModificarProveedorUseCase(proveedorRepositoryMock);
  });

  it('modifica proveedor existente', async () => {
    const proveedorActualizado = new Proveedor({
      ...proveedorExistente,
      ...dtoBase,
    });

    proveedorRepositoryMock.findById.mockResolvedValue(proveedorExistente);
    proveedorRepositoryMock.existsByNombreOrCorreoExcludingId.mockResolvedValue(
      false,
    );
    proveedorRepositoryMock.update.mockResolvedValue(proveedorActualizado);

    const result = await useCase.execute(dtoBase);

    expect(proveedorRepositoryMock.findById).toHaveBeenCalledWith(
      dtoBase.idProveedor,
    );
    expect(
      proveedorRepositoryMock.existsByNombreOrCorreoExcludingId,
    ).toHaveBeenCalledWith(
      dtoBase.nombre!,
      dtoBase.correo!,
      dtoBase.idProveedor,
    );
    expect(proveedorRepositoryMock.update).toHaveBeenCalledWith(
      dtoBase.idProveedor,
      {
        nombre: dtoBase.nombre,
        direccion: dtoBase.direccion,
        telefono: dtoBase.telefono,
        correo: dtoBase.correo,
        terminosEntrega: dtoBase.terminosEntrega,
      },
    );
    expect(result).toBe(proveedorActualizado);
  });

  it('lanza NotFoundException si no existe', async () => {
    proveedorRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(proveedorRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('lanza ConflictException si nombre/correo pertenece a otro proveedor', async () => {
    proveedorRepositoryMock.findById.mockResolvedValue(proveedorExistente);
    proveedorRepositoryMock.existsByNombreOrCorreoExcludingId.mockResolvedValue(
      true,
    );

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(proveedorRepositoryMock.update).not.toHaveBeenCalled();
  });
});
