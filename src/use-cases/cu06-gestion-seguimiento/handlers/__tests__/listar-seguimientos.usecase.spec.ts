import { Seguimiento } from '../../../../domain';
import type { SeguimientoRepository } from '../../../../infrastructure';
import { ListarSeguimientosDto } from '../../dto';
import { ListarSeguimientosUseCase } from '../listar-seguimientos.usecase';

describe('ListarSeguimientosUseCase', () => {
  let useCase: ListarSeguimientosUseCase;
  let seguimientoRepositoryMock: jest.Mocked<SeguimientoRepository>;

  beforeEach(() => {
    seguimientoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ListarSeguimientosUseCase(seguimientoRepositoryMock);
  });

  it('retorna lista', async () => {
    const seguimientos = [
      new Seguimiento({
        idSeguimiento: 1,
        idTarea: 10,
        fechaSeguimiento: new Date('2026-05-10T00:00:00.000Z'),
        estadoReportado: 'En curso',
        cantidadMaterialUsado: 4,
        porcentajeAvance: 25,
      }),
    ];

    seguimientoRepositoryMock.findMany.mockResolvedValue(seguimientos);

    await expect(useCase.execute({})).resolves.toBe(seguimientos);
  });

  it('pasa filtros idTarea, pagina y limite al repositorio', async () => {
    const dto: ListarSeguimientosDto = {
      idTarea: 10,
      pagina: 2,
      limite: 5,
    };

    seguimientoRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dto);

    expect(seguimientoRepositoryMock.findMany).toHaveBeenCalledWith({
      idTarea: 10,
      pagina: 2,
      limite: 5,
    });
  });
});
