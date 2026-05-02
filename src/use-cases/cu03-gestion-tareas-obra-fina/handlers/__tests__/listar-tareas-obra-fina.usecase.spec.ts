import {
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
  Tarea,
  TipoTarea,
} from '../../../../domain';
import type { TareaRepository } from '../../../../infrastructure';
import { ListarTareasObraFinaDto } from '../../dto';
import { ListarTareasObraFinaUseCase } from '../listar-tareas-obra-fina.usecase';

describe('ListarTareasObraFinaUseCase', () => {
  let useCase: ListarTareasObraFinaUseCase;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;

  beforeEach(() => {
    tareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ListarTareasObraFinaUseCase(tareaRepositoryMock);
  });

  it('retorna lista', async () => {
    const dto: ListarTareasObraFinaDto = {};
    const tareas = [
      new Tarea({
        idTarea: 1,
        nombre: 'Tarea Uno',
        descripcion: 'Descripcion',
        tipoTarea: TipoTarea.OBRA_FINA,
        perfilRequerido: OcupacionTrabajador.VIDRIERO,
        duracionEstimada: 2,
        fechaInicioPlanificada: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinPlanificada: new Date('2026-05-02T00:00:00.000Z'),
        estadoTarea: EstadoTarea.PENDIENTE,
        prioridad: PrioridadTarea.MEDIA,
        idCronograma: 10,
      }),
    ];

    tareaRepositoryMock.findMany.mockResolvedValue(tareas);

    const result = await useCase.execute(dto);

    expect(tareaRepositoryMock.findMany).toHaveBeenCalledWith({
      idProyecto: undefined,
      tipoTarea: TipoTarea.OBRA_FINA,
      busqueda: undefined,
      pagina: undefined,
      limite: undefined,
    });
    expect(result).toBe(tareas);
  });

  it('pasa filtros y tipoTarea OBRA_FINA al repositorio', async () => {
    const dto: ListarTareasObraFinaDto = {
      idProyecto: 14,
      busqueda: 'ventanales',
      pagina: 2,
      limite: 6,
    };

    tareaRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dto);

    expect(tareaRepositoryMock.findMany).toHaveBeenCalledWith({
      idProyecto: 14,
      tipoTarea: TipoTarea.OBRA_FINA,
      busqueda: 'ventanales',
      pagina: 2,
      limite: 6,
    });
  });
});
