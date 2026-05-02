import { OcupacionTrabajador, Trabajador } from '../../../../domain';
import type { TrabajadorRepository } from '../../../../infrastructure';
import { ListarTrabajadoresDto } from '../../dto';
import { ListarTrabajadoresUseCase } from '../listar-trabajadores.usecase';

describe('ListarTrabajadoresUseCase', () => {
  let useCase: ListarTrabajadoresUseCase;
  let trabajadorRepositoryMock: jest.Mocked<TrabajadorRepository>;

  beforeEach(() => {
    trabajadorRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByCiOrCorreo: jest.fn(),
      existsByCiOrCorreoExcludingId: jest.fn(),
    };

    useCase = new ListarTrabajadoresUseCase(trabajadorRepositoryMock);
  });

  it('retorna lista', async () => {
    const trabajadores = [
      new Trabajador({
        idTrabajador: 1,
        nombre: 'Luis Flores',
        ci: 'CI-1',
        telefono: '70000001',
        correo: 'luis@example.com',
        aniosExperiencia: 2,
        ocupacion: OcupacionTrabajador.ALBANIL,
      }),
    ];

    trabajadorRepositoryMock.findMany.mockResolvedValue(trabajadores);

    await expect(useCase.execute({})).resolves.toBe(trabajadores);
  });

  it('pasa filtros ocupacion, busqueda, pagina y limite al repositorio', async () => {
    const dto: ListarTrabajadoresDto = {
      ocupacion: OcupacionTrabajador.ELECTRICISTA,
      busqueda: 'E2E',
      pagina: 2,
      limite: 5,
    };

    trabajadorRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dto);

    expect(trabajadorRepositoryMock.findMany).toHaveBeenCalledWith({
      ocupacion: OcupacionTrabajador.ELECTRICISTA,
      busqueda: 'E2E',
      pagina: 2,
      limite: 5,
    });
  });
});
