import { ConflictException, NotFoundException } from '@nestjs/common';
import { Cliente } from '../../../../domain';
import type {
  ClienteRepository,
  ProyectoRepository,
} from '../../../../infrastructure';
import { EliminarClienteDto } from '../../dto';
import { EliminarClienteUseCase } from '../eliminar-cliente.usecase';

describe('EliminarClienteUseCase', () => {
  let useCase: EliminarClienteUseCase;
  let clienteRepositoryMock: jest.Mocked<ClienteRepository>;
  let proyectoRepositoryMock: jest.Mocked<ProyectoRepository>;

  const eliminarClienteDto: EliminarClienteDto = {
    idCliente: 18,
  };

  beforeEach(() => {
    clienteRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByCorreoOrTelefono: jest.fn(),
      existsByCorreoOrTelefonoExcludingId: jest.fn(),
    };

    proyectoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsActiveByCliente: jest.fn(),
    };

    useCase = new EliminarClienteUseCase(
      clienteRepositoryMock,
      proyectoRepositoryMock,
    );
  });

  it('elimina cliente sin proyectos activos', async () => {
    clienteRepositoryMock.findById.mockResolvedValue(
      new Cliente({
        idCliente: 18,
        nombre: 'Cliente Eliminable',
        direccion: 'Zona Norte',
        telefono: '70000006',
        correo: 'eliminar@e2e-cu01.local',
        tipoCliente: 'PERSONA_NATURAL',
      }),
    );
    proyectoRepositoryMock.existsActiveByCliente.mockResolvedValue(false);

    const result = await useCase.execute(eliminarClienteDto);

    expect(proyectoRepositoryMock.existsActiveByCliente).toHaveBeenCalledWith(
      18,
    );
    expect(clienteRepositoryMock.delete).toHaveBeenCalledWith(18);
    expect(result).toEqual({
      eliminado: true,
      idCliente: 18,
    });
  });

  it('lanza NotFoundException si no existe', async () => {
    clienteRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(eliminarClienteDto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('lanza ConflictException si tiene proyectos activos', async () => {
    clienteRepositoryMock.findById.mockResolvedValue(
      new Cliente({
        idCliente: 18,
        nombre: 'Cliente con Proyecto',
        direccion: 'Centro',
        telefono: '70000007',
        correo: 'activo@e2e-cu01.local',
        tipoCliente: 'EMPRESA',
      }),
    );
    proyectoRepositoryMock.existsActiveByCliente.mockResolvedValue(true);

    await expect(useCase.execute(eliminarClienteDto)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(clienteRepositoryMock.delete).not.toHaveBeenCalled();
  });
});
