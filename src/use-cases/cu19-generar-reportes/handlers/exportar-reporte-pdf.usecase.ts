import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  REPORTE_REPOSITORY,
  type ReporteRepository,
} from '../../../infrastructure';
import { ExportarReportePdfDto } from '../dto';

@Injectable()
export class ExportarReportePdfUseCase {
  constructor(
    @Inject(REPORTE_REPOSITORY)
    private readonly reporteRepository: ReporteRepository,
  ) {}

  async execute(dto: ExportarReportePdfDto): Promise<{
    idReporte: number;
    exportado: true;
    rutaArchivoPdf: string;
    mensaje: string;
  }> {
    const reporte = await this.reporteRepository.findById(dto.idReporte);

    if (!reporte) {
      throw new NotFoundException(
        `No se encontro el reporte con id ${dto.idReporte}.`,
      );
    }

    const rutaArchivoPdf = `reports/reporte-${dto.idReporte}.pdf`;

    await this.reporteRepository.update(dto.idReporte, {
      rutaArchivoPdf,
    });

    return {
      idReporte: dto.idReporte,
      exportado: true,
      rutaArchivoPdf,
      mensaje:
        'Exportación PDF provisional. No se generó archivo físico en esta fase.',
    };
  }
}
