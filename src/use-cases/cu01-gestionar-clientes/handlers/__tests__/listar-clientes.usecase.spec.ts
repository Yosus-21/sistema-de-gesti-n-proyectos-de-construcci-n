import { Cliente } from '../../../../domain';
import type { ClienteRepository } from '../../../../infrastructure';
import { ListarClientesDto } from '../../dto';
import { ListarClientesUseCase } from '../listar-clientes.usecase';

describe('ListarClientesUseCase', () => {
  let useCase: ListarClientesUseCase;
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

    useCase = new ListarClientesUseCase(clienteRepositoryMock);
  });

  it('retorna lista de clientes', async () => {
    const dto: ListarClientesDto = {};
    const clientes = [
      new Cliente({
        idCliente: 1,
        nombre: 'Cliente Uno',
        direccion: 'Dir 1',
        telefono: '70000008',
        correo: 'uno@e2e-cu01.local',
        tipoCliente: 'PERSONA_NATURAL',
      }),
    ];

    clienteRepositoryMock.findMany.mockResolvedValue(clientes);

    const result = await useCase.execute(dto);

    expect(clienteRepositoryMock.findMany).toHaveBeenCalledWith({
      busqueda: undefined,
      pagina: undefined,
      limite: undefined,
    });
    expect(result).toBe(clientes);
  });

  it('pasa filtros de busqueda, pagina y limite al repositorio', async () => {
    const dto: ListarClientesDto = {
      busqueda: 'Cliente',
      pagina: 2,
      limite: 5,
    };

    clienteRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dto);

    expect(clienteRepositoryMock.findMany).toHaveBeenCalledWith({
      busqueda: 'Cliente',
      pagina: 2,
      limite: 5,
    });
  });
});
