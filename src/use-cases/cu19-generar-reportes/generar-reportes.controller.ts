import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, Public, Roles, RolesGuard } from '../../auth';
import { RolUsuario } from '../../domain';
import { GenerarReportesService } from './generar-reportes.service';
import {
  ConsultarReporteDto,
  ExportarReportePdfDto,
  GenerarReporteDto,
  ListarReportesDto,
} from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeCreated,
  ApiEnvelopeOk,
  ApiNumericParam,
  ApiPaginationQueries,
  ApiProtectedResource,
  ApiStandardErrorResponses,
} from '../../common';

@ApiTags('CU19 - Reportes')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  RolUsuario.ADMIN,
  RolUsuario.GESTOR_PROYECTO,
  RolUsuario.ENCARGADO_COMPRAS,
)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu19/reportes')
export class GenerarReportesController {
  constructor(
    private readonly generarReportesService: GenerarReportesService,
  ) {}

  @ApiOperation({ summary: 'Verificar estado del módulo de reportes' })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.generarReportesService.check();
  }

  @ApiOperation({ summary: 'Generar reporte' })
  @ApiEnvelopeCreated('Reporte generado correctamente.')
  @Post()
  generar(@Body() dto: GenerarReporteDto) {
    return this.generarReportesService.generar(dto);
  }

  @ApiOperation({ summary: 'Listar reportes' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Reportes listados correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarReportesDto) {
    return this.generarReportesService.listar(dto);
  }

  @ApiOperation({ summary: 'Exportar reporte a PDF provisional' })
  @ApiNumericParam('idReporte', 'Identificador del reporte a exportar.')
  @ApiEnvelopeOk('Exportación provisional registrada correctamente.')
  @Patch(':idReporte/exportar-pdf')
  exportarPdf(@Param('idReporte', ParseIntPipe) idReporte: number) {
    const dto: ExportarReportePdfDto = { idReporte };
    return this.generarReportesService.exportarPdf(dto);
  }

  @ApiOperation({ summary: 'Consultar reporte por identificador' })
  @ApiNumericParam('idReporte', 'Identificador del reporte a consultar.')
  @ApiEnvelopeOk('Reporte consultado correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.LECTOR,
  )
  @Get(':idReporte')
  consultar(@Param('idReporte', ParseIntPipe) idReporte: number) {
    const dto: ConsultarReporteDto = { idReporte };
    return this.generarReportesService.consultar(dto);
  }
}
