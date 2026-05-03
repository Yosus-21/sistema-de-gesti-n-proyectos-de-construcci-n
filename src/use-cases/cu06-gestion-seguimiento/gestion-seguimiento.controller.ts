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
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { GestionSeguimientoService } from './gestion-seguimiento.service';
import {
  CalcularDesviacionDto,
  ConsultarSeguimientoDto,
  ListarSeguimientosDto,
  ModificarSeguimientoDto,
  RegistrarSeguimientoDto,
} from './dto';
import { ApiOperation, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Public, Roles, RolesGuard } from '../../auth';
import {
  ApiEnvelopeCreated,
  ApiEnvelopeOk,
  ApiNumericParam,
  ApiPaginationQueries,
  ApiProtectedResource,
  ApiStandardErrorResponses,
} from '../../common';
import { RolUsuario } from '../../domain';

class ModificarSeguimientoBodyDto {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaSeguimiento?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  estadoReportado?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  cantidadMaterialUsado?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @ApiPropertyOptional()
  porcentajeAvance?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  observaciones?: string;
}

@ApiTags('CU06 - Seguimientos')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  RolUsuario.ADMIN,
  RolUsuario.GESTOR_PROYECTO,
  RolUsuario.INGENIERO,
  RolUsuario.CONTRATISTA,
)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu06/seguimientos')
export class GestionSeguimientoController {
  constructor(
    private readonly gestionSeguimientoService: GestionSeguimientoService,
  ) {}

  @ApiOperation({ summary: 'Verificar estado del módulo de seguimientos' })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.gestionSeguimientoService.check();
  }

  @ApiOperation({ summary: 'Registrar seguimiento' })
  @ApiEnvelopeCreated('Seguimiento registrado correctamente.')
  @Post()
  registrar(@Body() dto: RegistrarSeguimientoDto) {
    return this.gestionSeguimientoService.registrar(dto);
  }

  @ApiOperation({ summary: 'Listar seguimientos' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Seguimientos listados correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.CONTRATISTA,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarSeguimientosDto) {
    return this.gestionSeguimientoService.listar(dto);
  }

  @ApiOperation({ summary: 'Calcular desviación de una tarea' })
  @ApiNumericParam('idTarea', 'Identificador de la tarea a evaluar.')
  @ApiEnvelopeOk('Desviación calculada correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.CONTRATISTA,
    RolUsuario.LECTOR,
  )
  @Get('tareas/:idTarea/desviacion')
  calcularDesviacion(@Param('idTarea', ParseIntPipe) idTarea: number) {
    const dto: CalcularDesviacionDto = { idTarea };
    return this.gestionSeguimientoService.calcularDesviacion(dto);
  }

  @ApiOperation({ summary: 'Consultar seguimiento por identificador' })
  @ApiNumericParam(
    'idSeguimiento',
    'Identificador del seguimiento a consultar.',
  )
  @ApiEnvelopeOk('Seguimiento consultado correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.CONTRATISTA,
    RolUsuario.LECTOR,
  )
  @Get(':idSeguimiento')
  consultar(@Param('idSeguimiento', ParseIntPipe) idSeguimiento: number) {
    const dto: ConsultarSeguimientoDto = { idSeguimiento };
    return this.gestionSeguimientoService.consultar(dto);
  }

  @ApiOperation({ summary: 'Modificar seguimiento' })
  @ApiNumericParam(
    'idSeguimiento',
    'Identificador del seguimiento a modificar.',
  )
  @ApiEnvelopeOk('Seguimiento modificado correctamente.')
  @Patch(':idSeguimiento')
  modificar(
    @Param('idSeguimiento', ParseIntPipe) idSeguimiento: number,
    @Body() dto: ModificarSeguimientoBodyDto,
  ) {
    const command: ModificarSeguimientoDto = {
      ...dto,
      idSeguimiento,
    };

    return this.gestionSeguimientoService.modificar(command);
  }
}
