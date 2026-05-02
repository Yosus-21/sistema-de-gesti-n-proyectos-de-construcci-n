import { Reporte, TipoReporte } from '../../../../domain';
import type { ReporteRepository } from '../../../../infrastructure';
import { ListarReportesDto } from '../../dto';
import { ListarReportesUseCase } from '../listar-reportes.usecase';

describe('ListarReportesUseCase', () => {
  let useCase: ListarReportesUseCase;
  let reporteRepositoryMock: jest.Mocked<ReporteRepository>;

  beforeEach(() => {
    reporteRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new ListarReportesUseCase(reporteRepositoryMock);
  });

  it('retorna lista', async () => {
    const reportes = [
      new Reporte({
        idReporte: 1,
        tipoReporte: TipoReporte.GENERAL,
        fechaGeneracion: new Date('2027-02-01T00:00:00.000Z'),
        contenidoResumen: 'Reporte general provisional del sistema.',
      }),
    ];

    reporteRepositoryMock.findMany.mockResolvedValue(reportes);

    const result = await useCase.execute({});

    expect(result).toBe(reportes);
  });

  it('pasa filtros idProyecto, tipoReporte, pagina y limite al repositorio', async () => {
    const dto: ListarReportesDto = {
      idProyecto: 7,
      tipoReporte: TipoReporte.MATERIALES,
      pagina: 2,
      limite: 15,
    };

    reporteRepositoryMock.findMany.mockResolvedValue([]);

    await useCase.execute(dto);

    expect(reporteRepositoryMock.findMany).toHaveBeenCalledWith({
      idProyecto: dto.idProyecto,
      tipoReporte: dto.tipoReporte,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  });
});
