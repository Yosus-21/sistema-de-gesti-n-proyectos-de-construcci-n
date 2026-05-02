import { ConflictException, NotFoundException } from '@nestjs/common';
import { Cliente } from '../../../../domain';
import type { ClienteRepository } from '../../../../infrastructure';
import { ModificarClienteDto } from '../../dto';
import { ModificarClienteUseCase } from '../modificar-cliente.usecase';

describe('ModificarClienteUseCase', () => {
  let useCase: ModificarClienteUseCase;
  let clienteRepositoryMock: jest.Mocked<ClienteRepository>;

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

    useCase = new ModificarClienteUseCase(clienteRepositoryMock);
  });

  it('modifica cliente existente', async () => {
    const dto: ModificarClienteDto = {
      idCliente: 12,
      nombre: 'Cliente Actualizado',
      correo: 'actualizado@e2e-cu01.local',
    };

    const clienteActual = new Cliente({
      idCliente: 12,
      nombre: 'Cliente Original',
      direccion: 'Av. Siempre Viva',
      telefono: '70000003',
      correo: 'original@e2e-cu01.local',
      tipoCliente: 'PERSONA_NATURAL',
    });

    const clienteActualizado = new Cliente({
      ...clienteActual,
      ...dto,
    });

    clienteRepositoryMock.findById.mockResolvedValue(clienteActual);
    clienteRepositoryMock.existsByCorreoOrTelefonoExcludingId.mockResolvedValue(
      false,
    );
    clienteRepositoryMock.update.mockResolvedValue(clienteActualizado);

    const result = await useCase.execute(dto);

    expect(
      clienteRepositoryMock.existsByCorreoOrTelefonoExcludingId,
    ).toHaveBeenCalledWith('actualizado@e2e-cu01.local', '70000003', 12);
    expect(clienteRepositoryMock.update).toHaveBeenCalledWith(12, {
      nombre: 'Cliente Actualizado',
      correo: 'actualizado@e2e-cu01.local',
    });
    expect(result).toBe(clienteActualizado);
  });

  it('lanza NotFoundException si no existe', async () => {
    clienteRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        idCliente: 404,
        nombre: 'No Importa',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lanza ConflictException si correo o telefono ya existe en otro cliente', async () => {
    const dto: ModificarClienteDto = {
      idCliente: 15,
      telefono: '79999999',
    };

    const clienteActual = new Cliente({
      idCliente: 15,
      nombre: 'Cliente Base',
      direccion: 'Zona Sur',
      telefono: '70000005',
      correo: 'base@e2e-cu01.local',
      tipoCliente: 'EMPRESA',
    });

    clienteRepositoryMock.findById.mockResolvedValue(clienteActual);
    clienteRepositoryMock.existsByCorreoOrTelefonoExcludingId.mockResolvedValue(
      true,
    );

    await expect(useCase.execute(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(clienteRepositoryMock.update).not.toHaveBeenCalled();
  });
});
