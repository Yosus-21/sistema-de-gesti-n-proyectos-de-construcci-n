import { NotFoundException } from '@nestjs/common';
import { Proveedor } from '../../../../domain';
import type { ProveedorRepository } from '../../../../infrastructure';
import { ConsultarProveedorDto } from '../../dto';
import { ConsultarProveedorUseCase } from '../consultar-proveedor.usecase';

describe('ConsultarProveedorUseCase', () => {
  let useCase: ConsultarProveedorUseCase;
  let proveedorRepositoryMock: jest.Mocked<ProveedorRepository>;

  const dtoBase: ConsultarProveedorDto = {
    idProveedor: 9,
  };

  const proveedorExistente = new Proveedor({
    idProveedor: 9,
    nombre: 'Proveedor Consulta',
    direccion: 'Av. Consulta',
    telefono: '70000011',
    correo: 'consulta@example.com',
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

    useCase = new ConsultarProveedorUseCase(proveedorRepositoryMock);
  });

  it('retorna proveedor existente', async () => {
    proveedorRepositoryMock.findById.mockResolvedValue(proveedorExistente);

    const result = await useCase.execute(dtoBase);

    expect(proveedorRepositoryMock.findById).toHaveBeenCalledWith(
      dtoBase.idProveedor,
    );
    expect(result).toBe(proveedorExistente);
  });

  it('lanza NotFoundException si no existe', async () => {
    proveedorRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
