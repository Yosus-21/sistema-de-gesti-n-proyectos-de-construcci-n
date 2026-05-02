import { Cronograma, EstadoCronograma } from '../../../../domain';
import type { CronogramaRepository } from '../../../../infrastructure';
import { ListarCronogramasDto } from '../../dto';
import { ListarCronogramasUseCase } from '../listar-cronogramas.usecase';

describe('ListarCronogramasUseCase', () => {
  let useCase: ListarCronogramasUseCase;
  let cronogramaRepositoryMock: jest.Mocked<CronogramaRepository>;

  beforeEach(() => {
    cronogramaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findByProyecto: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsByProyecto: jest.fn(),
    };

    useCase = new ListarCronogramasUseCase(cronogramaRepositoryMock);
  });

  it('retorna lista', async () => {
    const dto: ListarCronogramasDto = {};
    const cronogramas = [
      new Cronograma({
        idCronograma: 1,
        idProyecto: 13,
        nombre: 'Cronograma Uno',
        fechaCreacion: new Date('2026-05-01T00:00:00.000Z'),
        estadoCronograma: EstadoCronograma.PLANIFICADO,
      }),
    ];

    cronogramaRepositoryMock.findMany.mockResolvedValue(cronogramas);

    const result = await useCase.execute(dto);

    expect(cronogramaRepositoryMock.findMany).toHaveBeenCalledWith({
      idProyecto: undefined,
      busqueda: undefined,
      pagina: undefined,
      limite: undefined,
    });
    expect(result).toBe(cronogramas);
  });

  it('pasa filtros idProyecto, busqueda, pagina y limite al repositorio', async () => {
    const dto: ListarCronogramasDto = {
      idProyecto: 13,
      busqueda: 'Cronograma',
      pagina: 2,
      limite: 5,
    };

    cronogramaRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dto);

    expect(cronogramaRepositoryMock.findMany).toHaveBeenCalledWith({
      idProyecto: 13,
      busqueda: 'Cronograma',
      pagina: 2,
      limite: 5,
    });
  });
});
