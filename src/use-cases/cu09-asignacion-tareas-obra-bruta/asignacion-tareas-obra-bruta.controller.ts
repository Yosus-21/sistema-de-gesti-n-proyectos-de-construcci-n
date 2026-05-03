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
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AsignacionTareasObraBrutaService } from './asignacion-tareas-obra-bruta.service';
import {
  AsignarTareaObraBrutaDto,
  CancelarAsignacionObraBrutaDto,
  ConsultarAsignacionObraBrutaDto,
  ListarAsignacionesObraBrutaDto,
  ModificarAsignacionObraBrutaDto,
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

class ModificarAsignacionObraBrutaBodyDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idTarea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idTrabajador?: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaAsignacion?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  rolEnLaTarea?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  observaciones?: string;
}

@ApiTags('CU09 - Asignaciones Obra Bruta')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO, RolUsuario.INGENIERO)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu09/asignaciones-obra-bruta')
export class AsignacionTareasObraBrutaController {
  constructor(
    private readonly asignacionTareasObraBrutaService: AsignacionTareasObraBrutaService,
  ) {}

  @ApiOperation({
    summary: 'Verificar estado del módulo de asignaciones de obra bruta',
  })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.asignacionTareasObraBrutaService.check();
  }

  @ApiOperation({ summary: 'Asignar tarea de obra bruta' })
  @ApiEnvelopeCreated('Asignación registrada correctamente.')
  @Post()
  asignar(@Body() dto: AsignarTareaObraBrutaDto) {
    return this.asignacionTareasObraBrutaService.asignar(dto);
  }

  @ApiOperation({ summary: 'Listar asignaciones de obra bruta' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Asignaciones listadas correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarAsignacionesObraBrutaDto) {
    return this.asignacionTareasObraBrutaService.listar(dto);
  }

  @ApiOperation({ summary: 'Cancelar asignación de obra bruta' })
  @ApiNumericParam(
    'idAsignacionTarea',
    'Identificador de la asignación a cancelar.',
  )
  @ApiEnvelopeOk('Asignación cancelada correctamente.')
  @Patch(':idAsignacionTarea/cancelar')
  cancelar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
  ) {
    const dto: CancelarAsignacionObraBrutaDto = { idAsignacionTarea };
    return this.asignacionTareasObraBrutaService.cancelar(dto);
  }

  @ApiOperation({ summary: 'Consultar asignación de obra bruta' })
  @ApiNumericParam(
    'idAsignacionTarea',
    'Identificador de la asignación a consultar.',
  )
  @ApiEnvelopeOk('Asignación consultada correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.LECTOR,
  )
  @Get(':idAsignacionTarea')
  consultar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
  ) {
    const dto: ConsultarAsignacionObraBrutaDto = { idAsignacionTarea };
    return this.asignacionTareasObraBrutaService.consultar(dto);
  }

  @ApiOperation({ summary: 'Modificar asignación de obra bruta' })
  @ApiNumericParam(
    'idAsignacionTarea',
    'Identificador de la asignación a modificar.',
  )
  @ApiEnvelopeOk('Asignación modificada correctamente.')
  @Patch(':idAsignacionTarea')
  modificar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
    @Body() dto: ModificarAsignacionObraBrutaBodyDto,
  ) {
    const command: ModificarAsignacionObraBrutaDto = {
      ...dto,
      idAsignacionTarea,
    };

    return this.asignacionTareasObraBrutaService.modificar(command);
  }
}
