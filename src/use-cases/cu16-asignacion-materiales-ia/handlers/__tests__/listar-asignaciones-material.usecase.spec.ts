import { AsignacionMaterial, EstadoAsignacion } from '../../../../domain';
import type { AsignacionMaterialRepository } from '../../../../infrastructure';
import { ListarAsignacionesMaterialDto } from '../../dto';
import { ListarAsignacionesMaterialUseCase } from '../listar-asignaciones-material.usecase';

describe('ListarAsignacionesMaterialUseCase', () => {
  let useCase: ListarAsignacionesMaterialUseCase;
  let asignacionMaterialRepositoryMock: jest.Mocked<AsignacionMaterialRepository>;

  beforeEach(() => {
    asignacionMaterialRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ListarAsignacionesMaterialUseCase(
      asignacionMaterialRepositoryMock,
    );
  });

  it('retorna lista', async () => {
    const asignaciones = [
      new AsignacionMaterial({
        idAsignacionMaterial: 1,
        idTarea: 9,
        idMaterial: 3,
        cantidadAsignada: 1,
        fechaAsignacion: new Date('2026-07-01T00:00:00.000Z'),
        estadoAsignacion: EstadoAsignacion.PENDIENTE,
        generadaPorIa: true,
      }),
    ];

    asignacionMaterialRepositoryMock.findMany.mockResolvedValue(asignaciones);

    const result = await useCase.execute({});

    expect(result).toBe(asignaciones);
  });

  it('pasa filtros idTarea, pagina y limite al repositorio', async () => {
    const dto: ListarAsignacionesMaterialDto = {
      idTarea: 9,
      idProyecto: 4,
      pagina: 2,
      limite: 15,
    };

    asignacionMaterialRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dto);

    expect(asignacionMaterialRepositoryMock.findMany).toHaveBeenCalledWith({
      idTarea: dto.idTarea,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  });
});
