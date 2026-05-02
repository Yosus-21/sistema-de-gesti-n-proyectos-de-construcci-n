import { EstadoProyecto, Proyecto } from '../../../../domain';
import type { ProyectoRepository } from '../../../../infrastructure';
import { ListarProyectosDto } from '../../dto';
import { ListarProyectosUseCase } from '../listar-proyectos.usecase';

describe('ListarProyectosUseCase', () => {
  let useCase: ListarProyectosUseCase;
  let proyectoRepositoryMock: jest.Mocked<ProyectoRepository>;

  beforeEach(() => {
    proyectoRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      existsActiveByCliente: jest.fn(),
    };

    useCase = new ListarProyectosUseCase(proyectoRepositoryMock);
  });

  it('retorna lista', async () => {
    const dto: ListarProyectosDto = {};
    const proyectos = [
      new Proyecto({
        idProyecto: 1,
        idCliente: 9,
        nombre: 'Proyecto Uno',
        descripcion: 'Descripcion',
        ubicacion: 'Santa Cruz',
        presupuesto: 25000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-06-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs',
      }),
    ];

    proyectoRepositoryMock.findMany.mockResolvedValue(proyectos);

    const result = await useCase.execute(dto);

    expect(proyectoRepositoryMock.findMany).toHaveBeenCalledWith({
      idCliente: undefined,
      busqueda: undefined,
      pagina: undefined,
      limite: undefined,
    });
    expect(result).toBe(proyectos);
  });

  it('pasa filtros idCliente, busqueda, pagina y limite al repositorio', async () => {
    const dto: ListarProyectosDto = {
      idCliente: 5,
      busqueda: 'Proyecto',
      pagina: 2,
      limite: 10,
    };

    proyectoRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dto);

    expect(proyectoRepositoryMock.findMany).toHaveBeenCalledWith({
      idCliente: 5,
      busqueda: 'Proyecto',
      pagina: 2,
      limite: 10,
    });
  });
});
