import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { GenerarReportesService } from './generar-reportes.service';
import {
  ConsultarReporteDto,
  ExportarReportePdfDto,
  GenerarReporteDto,
  ListarReportesDto,
} from './dto';

@Controller('cu19/reportes')
export class GenerarReportesController {
  constructor(
    private readonly generarReportesService: GenerarReportesService,
  ) {}

  @Get('health')
  check() {
    return this.generarReportesService.check();
  }

  @Post()
  generar(@Body() dto: GenerarReporteDto) {
    return this.generarReportesService.generar(dto);
  }

  @Get()
  listar(@Query() dto: ListarReportesDto) {
    return this.generarReportesService.listar(dto);
  }

  @Patch(':idReporte/exportar-pdf')
  exportarPdf(@Param('idReporte', ParseIntPipe) idReporte: number) {
    const dto: ExportarReportePdfDto = { idReporte };
    return this.generarReportesService.exportarPdf(dto);
  }

  @Get(':idReporte')
  consultar(@Param('idReporte', ParseIntPipe) idReporte: number) {
    const dto: ConsultarReporteDto = { idReporte };
    return this.generarReportesService.consultar(dto);
  }
}
