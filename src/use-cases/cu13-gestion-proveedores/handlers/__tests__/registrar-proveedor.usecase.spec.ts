import { ConflictException } from '@nestjs/common';
import { Proveedor } from '../../../../domain';
import type { ProveedorRepository } from '../../../../infrastructure';
import { RegistrarProveedorDto } from '../../dto';
import { RegistrarProveedorUseCase } from '../registrar-proveedor.usecase';

describe('RegistrarProveedorUseCase', () => {
  let useCase: RegistrarProveedorUseCase;
  let proveedorRepositoryMock: jest.Mocked<ProveedorRepository>;

  const dtoBase: RegistrarProveedorDto = {
    nombre: 'Proveedor Base',
    direccion: 'Av. Siempre Viva 123',
    telefono: '76543210',
    correo: 'proveedor@example.com',
    terminosEntrega: 'Entrega en 48 horas',
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

    useCase = new RegistrarProveedorUseCase(proveedorRepositoryMock);
  });

  it('registra proveedor correctamente', async () => {
    const proveedorCreado = new Proveedor({
      idProveedor: 14,
      ...dtoBase,
    });

    proveedorRepositoryMock.existsByNombreOrCorreo.mockResolvedValue(false);
    proveedorRepositoryMock.create.mockResolvedValue(proveedorCreado);

    const result = await useCase.execute(dtoBase);

    expect(proveedorRepositoryMock.existsByNombreOrCorreo).toHaveBeenCalledWith(
      dtoBase.nombre,
      dtoBase.correo,
    );
    expect(proveedorRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: dtoBase.nombre,
        direccion: dtoBase.direccion,
        telefono: dtoBase.telefono,
        correo: dtoBase.correo,
        terminosEntrega: dtoBase.terminosEntrega,
      }),
    );
    expect(result).toBe(proveedorCreado);
  });

  it('lanza ConflictException si nombre o correo ya existe', async () => {
    proveedorRepositoryMock.existsByNombreOrCorreo.mockResolvedValue(true);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(proveedorRepositoryMock.create).not.toHaveBeenCalled();
  });
});
