import { NotFoundException } from '@nestjs/common';
import { Reporte, TipoReporte } from '../../../../domain';
import type {
  ReporteRepository,
  ReportPdfPort,
} from '../../../../infrastructure';
import { ExportarReportePdfDto } from '../../dto';
import { ExportarReportePdfUseCase } from '../exportar-reporte-pdf.usecase';

describe('ExportarReportePdfUseCase', () => {
  let useCase: ExportarReportePdfUseCase;
  let reporteRepositoryMock: jest.Mocked<ReporteRepository>;
  let reportPdfPortMock: jest.Mocked<ReportPdfPort>;

  const dtoBase: ExportarReportePdfDto = {
    idReporte: 21,
  };

  beforeEach(() => {
    reporteRepositoryMock = {
      create: jest.fn(),
      findById: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    reportPdfPortMock = {
      generateReportPdf: jest.fn(),
    };

    useCase = new ExportarReportePdfUseCase(
      reporteRepositoryMock,
      reportPdfPortMock,
    );
  });

  it('exporta PDF físico actualizando rutaArchivoPdf', async () => {
    const reporteExistente = new Reporte({
      idReporte: 21,
      tipoReporte: TipoReporte.COSTOS,
      fechaGeneracion: new Date('2027-02-10T00:00:00.000Z'),
      contenidoResumen: 'Reporte provisional de costos.',
    });

    reporteRepositoryMock.findById.mockResolvedValue(reporteExistente);
    reporteRepositoryMock.update.mockResolvedValue(
      new Reporte({
        ...reporteExistente,
        rutaArchivoPdf: 'reports/reporte-21-12345.pdf',
      }),
    );

    reportPdfPortMock.generateReportPdf.mockResolvedValue({
      filePath: '/absolute/path/reports/reporte-21-12345.pdf',
      relativePath: 'reports/reporte-21-12345.pdf',
    });

    const result = await useCase.execute(dtoBase);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(reportPdfPortMock.generateReportPdf).toHaveBeenCalledWith({
      idReporte: 21,
      tipoReporte: TipoReporte.COSTOS,
      fechaGeneracion: new Date('2027-02-10T00:00:00.000Z'),
      fechaInicioPeriodo: undefined,
      fechaFinPeriodo: undefined,
      porcentajeAvanceGeneral: undefined,
      contenidoResumen: 'Reporte provisional de costos.',
      idProyecto: undefined,
    });

    expect(reporteRepositoryMock.update).toHaveBeenCalledWith(21, {
      rutaArchivoPdf: 'reports/reporte-21-12345.pdf',
    });
    expect(result).toEqual({
      idReporte: 21,
      exportado: true,
      rutaArchivoPdf: 'reports/reporte-21-12345.pdf',
      generadoFisicamente: true,
      mensaje: 'Reporte PDF generado correctamente.',
    });
  });

  it('lanza NotFoundException si reporte no existe', async () => {
    reporteRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
