import { PronosticoMaterial } from '../../../../domain';
import type { PronosticoMaterialRepository } from '../../../../infrastructure';
import { ListarPronosticosMaterialDto } from '../../dto';
import { ListarPronosticosMaterialUseCase } from '../listar-pronosticos-material.usecase';

describe('ListarPronosticosMaterialUseCase', () => {
  let useCase: ListarPronosticosMaterialUseCase;
  let pronosticoMaterialRepositoryMock: jest.Mocked<PronosticoMaterialRepository>;

  beforeEach(() => {
    pronosticoMaterialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ListarPronosticosMaterialUseCase(
      pronosticoMaterialRepositoryMock,
    );
  });

  it('retorna lista', async () => {
    const pronosticos = [
      new PronosticoMaterial({
        idPronosticoMaterial: 1,
        idProyecto: 5,
        idMaterial: 9,
        periodoAnalisis: '2026-Q4',
        stockMinimo: 8,
        stockMaximo: 20,
        fechaGeneracion: new Date('2026-10-10T00:00:00.000Z'),
        nivelConfianza: 85,
      }),
    ];

    pronosticoMaterialRepositoryMock.findMany.mockResolvedValue(pronosticos);

    const result = await useCase.execute({});

    expect(result).toBe(pronosticos);
  });

  it('pasa filtros idProyecto, idMaterial, pagina y limite al repositorio', async () => {
    const dto: ListarPronosticosMaterialDto = {
      idProyecto: 7,
      idMaterial: 9,
      pagina: 2,
      limite: 15,
    };

    pronosticoMaterialRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dto);

    expect(pronosticoMaterialRepositoryMock.findMany).toHaveBeenCalledWith({
      idProyecto: dto.idProyecto,
      idMaterial: dto.idMaterial,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  });
});
