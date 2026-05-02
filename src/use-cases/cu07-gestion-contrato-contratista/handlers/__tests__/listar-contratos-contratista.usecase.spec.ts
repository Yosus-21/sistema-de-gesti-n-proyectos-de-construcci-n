import { Contrato } from '../../../../domain';
import type { ContratoRepository } from '../../../../infrastructure';
import { ListarContratosContratistaDto } from '../../dto';
import { ListarContratosContratistaUseCase } from '../listar-contratos-contratista.usecase';

describe('ListarContratosContratistaUseCase', () => {
  let useCase: ListarContratosContratistaUseCase;
  let contratoRepositoryMock: jest.Mocked<ContratoRepository>;

  beforeEach(() => {
    contratoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ListarContratosContratistaUseCase(contratoRepositoryMock);
  });

  it('retorna lista', async () => {
    const contratos = [
      new Contrato({
        idContrato: 1,
        idProyecto: 10,
        idContratista: 22,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFin: new Date('2026-05-06T00:00:00.000Z'),
        metodoPago: 'Transferencia',
        terminosYCondiciones: 'Base',
        estadoContrato: 'VIGENTE',
        costoTotal: 1250,
      }),
    ];

    contratoRepositoryMock.findMany.mockResolvedValue(contratos);

    await expect(useCase.execute({})).resolves.toBe(contratos);
  });

  it('pasa filtros idProyecto, idContratista, pagina y limite', async () => {
    const dto: ListarContratosContratistaDto = {
      idProyecto: 10,
      idContratista: 22,
      pagina: 2,
      limite: 5,
    };

    contratoRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dto);

    expect(contratoRepositoryMock.findMany).toHaveBeenCalledWith({
      idProyecto: 10,
      idContratista: 22,
      pagina: 2,
      limite: 5,
    });
  });
});
