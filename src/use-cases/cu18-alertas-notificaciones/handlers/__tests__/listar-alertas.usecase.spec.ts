import { Alerta, EstadoAlerta, TipoAlerta } from '../../../../domain';
import type { AlertaRepository } from '../../../../infrastructure';
import { ListarAlertasDto } from '../../dto';
import { ListarAlertasUseCase } from '../listar-alertas.usecase';

describe('ListarAlertasUseCase', () => {
  let useCase: ListarAlertasUseCase;
  let alertaRepositoryMock: jest.Mocked<AlertaRepository>;

  beforeEach(() => {
    alertaRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ListarAlertasUseCase(alertaRepositoryMock);
  });

  it('retorna lista', async () => {
    const alertas = [
      new Alerta({
        idAlerta: 1,
        criterioActivacion: 'Criterio',
        tipoAlerta: TipoAlerta.MATERIAL_BAJO,
        estadoAlerta: EstadoAlerta.ACTIVA,
      }),
    ];

    alertaRepositoryMock.findMany.mockResolvedValue(alertas);

    const result = await useCase.execute({});

    expect(result).toBe(alertas);
  });

  it('pasa filtros idProyecto, idTarea, idMaterial, tipoAlerta, estadoAlerta, pagina y limite al repositorio', async () => {
    const dto: ListarAlertasDto = {
      idProyecto: 5,
      idTarea: 9,
      idMaterial: 11,
      tipoAlerta: TipoAlerta.RETRASO_TAREA,
      estadoAlerta: EstadoAlerta.NOTIFICADA,
      pagina: 2,
      limite: 25,
    };

    alertaRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dto);

    expect(alertaRepositoryMock.findMany).toHaveBeenCalledWith({
      idProyecto: dto.idProyecto,
      idTarea: dto.idTarea,
      idMaterial: dto.idMaterial,
      tipoAlerta: dto.tipoAlerta,
      estadoAlerta: dto.estadoAlerta,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  });
});
