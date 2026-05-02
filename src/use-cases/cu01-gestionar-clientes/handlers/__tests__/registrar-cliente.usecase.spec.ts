import { ConflictException } from '@nestjs/common';
import { Cliente } from '../../../../domain';
import type { ClienteRepository } from '../../../../infrastructure';
import { RegistrarClienteDto } from '../../dto';
import { RegistrarClienteUseCase } from '../registrar-cliente.usecase';

describe('RegistrarClienteUseCase', () => {
  let useCase: RegistrarClienteUseCase;
  let clienteRepositoryMock: jest.Mocked<ClienteRepository>;

  const registrarClienteDto: RegistrarClienteDto = {
    nombre: 'Cliente Uno',
    direccion: 'Calle Falsa 123',
    telefono: '70000001',
    correo: 'cliente1@e2e-cu01.local',
    tipoCliente: 'PERSONA_NATURAL',
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

    useCase = new RegistrarClienteUseCase(clienteRepositoryMock);
  });

  it('registra cliente correctamente', async () => {
    const clienteCreado = new Cliente({
      idCliente: 1,
      ...registrarClienteDto,
    });

    clienteRepositoryMock.existsByCorreoOrTelefono.mockResolvedValue(false);
    clienteRepositoryMock.create.mockResolvedValue(clienteCreado);

    const result = await useCase.execute(registrarClienteDto);

    expect(clienteRepositoryMock.existsByCorreoOrTelefono).toHaveBeenCalledWith(
      registrarClienteDto.correo,
      registrarClienteDto.telefono,
    );
    expect(clienteRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining(registrarClienteDto),
    );
    expect(result).toBe(clienteCreado);
  });

  it('lanza ConflictException si existe correo o telefono duplicado', async () => {
    clienteRepositoryMock.existsByCorreoOrTelefono.mockResolvedValue(true);

    await expect(useCase.execute(registrarClienteDto)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(clienteRepositoryMock.create).not.toHaveBeenCalled();
  });
});
