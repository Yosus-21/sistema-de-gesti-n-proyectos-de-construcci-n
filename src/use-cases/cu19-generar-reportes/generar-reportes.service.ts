import { Injectable } from '@nestjs/common';
import {
  ConsultarReporteDto,
  ExportarReportePdfDto,
  GenerarReporteDto,
  ListarReportesDto,
} from './dto';
import {
  ConsultarReporteUseCase,
  ExportarReportePdfUseCase,
  GenerarReporteUseCase,
  ListarReportesUseCase,
} from './handlers';

@Injectable()
export class GenerarReportesService {
  constructor(
    private readonly generarReporteUseCase: GenerarReporteUseCase,
    private readonly consultarReporteUseCase: ConsultarReporteUseCase,
    private readonly listarReportesUseCase: ListarReportesUseCase,
    private readonly exportarReportePdfUseCase: ExportarReportePdfUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu19-generar-reportes',
      status: 'ok' as const,
    };
  }

  generar(dto: GenerarReporteDto) {
    return this.generarReporteUseCase.execute(dto);
  }

  consultar(dto: ConsultarReporteDto) {
    return this.consultarReporteUseCase.execute(dto);
  }

  listar(dto: ListarReportesDto) {
    return this.listarReportesUseCase.execute(dto);
  }

  exportarPdf(dto: ExportarReportePdfDto) {
    return this.exportarReportePdfUseCase.execute(dto);
  }
}
