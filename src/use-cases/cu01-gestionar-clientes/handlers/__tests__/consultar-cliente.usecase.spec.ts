import { NotFoundException } from '@nestjs/common';
import { Cliente } from '../../../../domain';
import type { ClienteRepository } from '../../../../infrastructure';
import { ConsultarClienteDto } from '../../dto';
import { ConsultarClienteUseCase } from '../consultar-cliente.usecase';

describe('ConsultarClienteUseCase', () => {
  let useCase: ConsultarClienteUseCase;
  let clienteRepositoryMock: jest.Mocked<ClienteRepository>;

  const consultarClienteDto: ConsultarClienteDto = {
    idCliente: 10,
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

    useCase = new ConsultarClienteUseCase(clienteRepositoryMock);
  });

  it('retorna cliente existente', async () => {
    const cliente = new Cliente({
      idCliente: 10,
      nombre: 'Cliente Existente',
      direccion: 'Zona Centro',
      telefono: '70000002',
      correo: 'existente@e2e-cu01.local',
      tipoCliente: 'EMPRESA',
    });

    clienteRepositoryMock.findById.mockResolvedValue(cliente);

    const result = await useCase.execute(consultarClienteDto);

    expect(clienteRepositoryMock.findById).toHaveBeenCalledWith(10);
    expect(result).toBe(cliente);
  });

  it('lanza NotFoundException si no existe', async () => {
    clienteRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(consultarClienteDto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
