import { AsignacionTarea, EstadoAsignacion } from '../../../../domain';
import type { AsignacionTareaRepository } from '../../../../infrastructure';
import { ListarAsignacionesContratistaDto } from '../../dto';
import { ListarAsignacionesContratistaUseCase } from '../listar-asignaciones-contratista.usecase';

describe('ListarAsignacionesContratistaUseCase', () => {
  let useCase: ListarAsignacionesContratistaUseCase;
  let asignacionTareaRepositoryMock: jest.Mocked<AsignacionTareaRepository>;

  beforeEach(() => {
    asignacionTareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsActiveAssignment: jest.fn(),
    };

    useCase = new ListarAsignacionesContratistaUseCase(
      asignacionTareaRepositoryMock,
    );
  });

  it('retorna lista', async () => {
    const asignaciones = [
      new AsignacionTarea({
        idAsignacionTarea: 1,
        idTarea: 10,
        idTrabajador: 22,
        fechaAsignacion: new Date('2026-05-10T00:00:00.000Z'),
        rolEnLaTarea: 'Operario',
        estadoAsignacion: EstadoAsignacion.CONFIRMADA,
        asignadaPorContratista: true,
      }),
    ];

    asignacionTareaRepositoryMock.findMany.mockResolvedValue(asignaciones);

    const result = await useCase.execute({});

    expect(result).toBe(asignaciones);
  });

  it('pasa filtros idTarea, idTrabajador, pagina, limite y asignadaPorContratista true al repositorio', async () => {
    const dto: ListarAsignacionesContratistaDto = {
      idContratista: 30,
      idTarea: 10,
      idTrabajador: 22,
      pagina: 2,
      limite: 5,
    };

    asignacionTareaRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dto);

    expect(asignacionTareaRepositoryMock.findMany).toHaveBeenCalledWith({
      idTarea: 10,
      idTrabajador: 22,
      asignadaPorContratista: true,
      pagina: 2,
      limite: 5,
    });
  });
});
