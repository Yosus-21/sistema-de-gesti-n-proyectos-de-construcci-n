import { Module } from '@nestjs/common';
import { RepositoriesModule, ReportsModule } from '../../infrastructure';
import { GenerarReportesController } from './generar-reportes.controller';
import { GenerarReportesService } from './generar-reportes.service';
import {
  GenerarReporteUseCase,
  ConsultarReporteUseCase,
  ListarReportesUseCase,
  ExportarReportePdfUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule, ReportsModule],
  controllers: [GenerarReportesController],
  providers: [
    GenerarReportesService,
    GenerarReporteUseCase,
    ConsultarReporteUseCase,
    ListarReportesUseCase,
    ExportarReportePdfUseCase,
  ],
})
export class Cu19Module {}
