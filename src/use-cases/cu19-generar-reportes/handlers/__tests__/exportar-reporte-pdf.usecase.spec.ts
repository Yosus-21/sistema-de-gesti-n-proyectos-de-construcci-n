import { NotFoundException } from '@nestjs/common';
import { Reporte, TipoReporte } from '../../../../domain';
import type { ReporteRepository } from '../../../../infrastructure';
import { ExportarReportePdfDto } from '../../dto';
import { ExportarReportePdfUseCase } from '../exportar-reporte-pdf.usecase';

describe('ExportarReportePdfUseCase', () => {
  let useCase: ExportarReportePdfUseCase;
  let reporteRepositoryMock: jest.Mocked<ReporteRepository>;

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

    useCase = new ExportarReportePdfUseCase(reporteRepositoryMock);
  });

  it('exporta PDF provisional actualizando rutaArchivoPdf', async () => {
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
        rutaArchivoPdf: 'reports/reporte-21.pdf',
      }),
    );

    const result = await useCase.execute(dtoBase);

    expect(reporteRepositoryMock.update).toHaveBeenCalledWith(21, {
      rutaArchivoPdf: 'reports/reporte-21.pdf',
    });
    expect(result).toEqual({
      idReporte: 21,
      exportado: true,
      rutaArchivoPdf: 'reports/reporte-21.pdf',
      mensaje:
        'Exportación PDF provisional. No se generó archivo físico en esta fase.',
    });
  });

  it('lanza NotFoundException si reporte no existe', async () => {
    reporteRepositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(dtoBase)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
