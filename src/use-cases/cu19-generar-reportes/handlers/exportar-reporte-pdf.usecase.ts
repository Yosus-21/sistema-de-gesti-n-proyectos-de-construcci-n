import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  REPORTE_REPOSITORY,
  type ReporteRepository,
  REPORT_PDF_PORT,
  type ReportPdfPort,
} from '../../../infrastructure';
import { ExportarReportePdfDto } from '../dto';

@Injectable()
export class ExportarReportePdfUseCase {
  constructor(
    @Inject(REPORTE_REPOSITORY)
    private readonly reporteRepository: ReporteRepository,
    @Inject(REPORT_PDF_PORT)
    private readonly reportPdfPort: ReportPdfPort,
  ) {}

  async execute(dto: ExportarReportePdfDto): Promise<{
    idReporte: number;
    exportado: true;
    rutaArchivoPdf: string;
    mensaje: string;
    generadoFisicamente: boolean;
  }> {
    const reporte = await this.reporteRepository.findById(dto.idReporte);

    if (!reporte) {
      throw new NotFoundException(
        `No se encontro el reporte con id ${dto.idReporte}.`,
      );
    }

    const { relativePath } = await this.reportPdfPort.generateReportPdf({
      idReporte: reporte.idReporte as number,
      tipoReporte: reporte.tipoReporte,
      fechaGeneracion: reporte.fechaGeneracion,
      fechaInicioPeriodo: reporte.fechaInicioPeriodo,
      fechaFinPeriodo: reporte.fechaFinPeriodo,
      porcentajeAvanceGeneral: reporte.porcentajeAvanceGeneral,
      contenidoResumen: reporte.contenidoResumen,
      idProyecto: reporte.idProyecto,
    });

    await this.reporteRepository.update(dto.idReporte, {
      rutaArchivoPdf: relativePath,
    });

    return {
      idReporte: dto.idReporte,
      exportado: true,
      rutaArchivoPdf: relativePath,
      generadoFisicamente: true,
      mensaje: 'Reporte PDF generado correctamente.',
    };
  }
}
