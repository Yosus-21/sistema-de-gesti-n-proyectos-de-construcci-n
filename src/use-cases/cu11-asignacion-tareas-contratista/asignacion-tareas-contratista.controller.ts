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
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { AsignacionTareasContratistaService } from './asignacion-tareas-contratista.service';
import {
  AsignarTareaContratistaDto,
  CancelarAsignacionContratistaDto,
  ConsultarAsignacionContratistaDto,
  ListarAsignacionesContratistaDto,
  ReasignarTrabajadorContratistaDto,
} from './dto';
import {
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
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

class ReasignarTrabajadorContratistaBodyDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idNuevoTrabajador: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  motivoReasignacion?: string;
}

@ApiTags('CU11 - Asignaciones Contratista')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO, RolUsuario.CONTRATISTA)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu11/asignaciones-contratista')
export class AsignacionTareasContratistaController {
  constructor(
    private readonly asignacionTareasContratistaService: AsignacionTareasContratistaService,
  ) {}

  @ApiOperation({
    summary: 'Verificar estado del módulo de asignaciones por contratista',
  })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.asignacionTareasContratistaService.check();
  }

  @ApiOperation({ summary: 'Asignar tarea a contratista' })
  @ApiEnvelopeCreated('Asignación registrada correctamente.')
  @Post()
  asignar(@Body() dto: AsignarTareaContratistaDto) {
    return this.asignacionTareasContratistaService.asignar(dto);
  }

  @ApiOperation({ summary: 'Listar asignaciones de contratista' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Asignaciones listadas correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.CONTRATISTA,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarAsignacionesContratistaDto) {
    return this.asignacionTareasContratistaService.listar(dto);
  }

  @ApiOperation({ summary: 'Reasignar tarea del contratista' })
  @ApiNumericParam(
    'idAsignacionTarea',
    'Identificador de la asignación a reasignar.',
  )
  @ApiEnvelopeOk('Asignación reasignada correctamente.')
  @Patch(':idAsignacionTarea/reasignar')
  reasignar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
    @Body() dto: ReasignarTrabajadorContratistaBodyDto,
  ) {
    const command: ReasignarTrabajadorContratistaDto = {
      ...dto,
      idAsignacionTarea,
    };

    return this.asignacionTareasContratistaService.reasignar(command);
  }

  @ApiOperation({ summary: 'Cancelar asignación del contratista' })
  @ApiNumericParam(
    'idAsignacionTarea',
    'Identificador de la asignación a cancelar.',
  )
  @ApiEnvelopeOk('Asignación cancelada correctamente.')
  @Patch(':idAsignacionTarea/cancelar')
  cancelar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
  ) {
    const dto: CancelarAsignacionContratistaDto = { idAsignacionTarea };
    return this.asignacionTareasContratistaService.cancelar(dto);
  }

  @ApiOperation({ summary: 'Consultar asignación del contratista' })
  @ApiNumericParam(
    'idAsignacionTarea',
    'Identificador de la asignación a consultar.',
  )
  @ApiEnvelopeOk('Asignación consultada correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.CONTRATISTA,
    RolUsuario.LECTOR,
  )
  @Get(':idAsignacionTarea')
  consultar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
  ) {
    const dto: ConsultarAsignacionContratistaDto = { idAsignacionTarea };
    return this.asignacionTareasContratistaService.consultar(dto);
  }
}
