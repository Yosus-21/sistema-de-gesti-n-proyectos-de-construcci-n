import {
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
  Tarea,
  TipoTarea,
} from '../../../../domain';
import type { TareaRepository } from '../../../../infrastructure';
import { ListarTareasObraBrutaDto } from '../../dto';
import { ListarTareasObraBrutaUseCase } from '../listar-tareas-obra-bruta.usecase';

describe('ListarTareasObraBrutaUseCase', () => {
  let useCase: ListarTareasObraBrutaUseCase;
  let tareaRepositoryMock: jest.Mocked<TareaRepository>;

  beforeEach(() => {
    tareaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ListarTareasObraBrutaUseCase(tareaRepositoryMock);
  });

  it('retorna lista', async () => {
    const dto: ListarTareasObraBrutaDto = {};
    const tareas = [
      new Tarea({
        idTarea: 1,
        nombre: 'Tarea Uno',
        descripcion: 'Descripcion',
        tipoTarea: TipoTarea.OBRA_BRUTA,
        perfilRequerido: OcupacionTrabajador.ALBANIL,
        duracionEstimada: 2,
        fechaInicioPlanificada: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinPlanificada: new Date('2026-05-02T00:00:00.000Z'),
        estadoTarea: EstadoTarea.PENDIENTE,
        prioridad: PrioridadTarea.MEDIA,
        idCronograma: 15,
      }),
    ];

    tareaRepositoryMock.findMany.mockResolvedValue(tareas);

    const result = await useCase.execute(dto);

    expect(tareaRepositoryMock.findMany).toHaveBeenCalledWith({
      idProyecto: undefined,
      tipoTarea: TipoTarea.OBRA_BRUTA,
      busqueda: undefined,
      pagina: undefined,
      limite: undefined,
    });
    expect(result).toBe(tareas);
  });

  it('pasa filtros y tipoTarea OBRA_BRUTA al repositorio', async () => {
    const dto: ListarTareasObraBrutaDto = {
      idProyecto: 44,
      busqueda: 'muros',
      pagina: 2,
      limite: 6,
    };

    tareaRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dto);

    expect(tareaRepositoryMock.findMany).toHaveBeenCalledWith({
      idProyecto: 44,
      tipoTarea: TipoTarea.OBRA_BRUTA,
      busqueda: 'muros',
      pagina: 2,
      limite: 6,
    });
  });
});
