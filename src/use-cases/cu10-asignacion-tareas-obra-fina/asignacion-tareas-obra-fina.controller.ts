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
import { AsignacionTareasObraFinaService } from './asignacion-tareas-obra-fina.service';
import {
  AsignarTareaObraFinaDto,
  CancelarAsignacionObraFinaDto,
  ConsultarAsignacionObraFinaDto,
  ListarAsignacionesObraFinaDto,
  ModificarAsignacionObraFinaDto,
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

class ModificarAsignacionObraFinaBodyDto {
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

@ApiTags('CU10 - Asignaciones Obra Fina')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO, RolUsuario.INGENIERO)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu10/asignaciones-obra-fina')
export class AsignacionTareasObraFinaController {
  constructor(
    private readonly asignacionTareasObraFinaService: AsignacionTareasObraFinaService,
  ) {}

  @ApiOperation({
    summary: 'Verificar estado del módulo de asignaciones de obra fina',
  })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.asignacionTareasObraFinaService.check();
  }

  @ApiOperation({ summary: 'Asignar tarea de obra fina' })
  @ApiEnvelopeCreated('Asignación registrada correctamente.')
  @Post()
  asignar(@Body() dto: AsignarTareaObraFinaDto) {
    return this.asignacionTareasObraFinaService.asignar(dto);
  }

  @ApiOperation({ summary: 'Listar asignaciones de obra fina' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Asignaciones listadas correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarAsignacionesObraFinaDto) {
    return this.asignacionTareasObraFinaService.listar(dto);
  }

  @ApiOperation({ summary: 'Cancelar asignación de obra fina' })
  @ApiNumericParam(
    'idAsignacionTarea',
    'Identificador de la asignación a cancelar.',
  )
  @ApiEnvelopeOk('Asignación cancelada correctamente.')
  @Patch(':idAsignacionTarea/cancelar')
  cancelar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
  ) {
    const dto: CancelarAsignacionObraFinaDto = { idAsignacionTarea };
    return this.asignacionTareasObraFinaService.cancelar(dto);
  }

  @ApiOperation({ summary: 'Consultar asignación de obra fina' })
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
    const dto: ConsultarAsignacionObraFinaDto = { idAsignacionTarea };
    return this.asignacionTareasObraFinaService.consultar(dto);
  }

  @ApiOperation({ summary: 'Modificar asignación de obra fina' })
  @ApiNumericParam(
    'idAsignacionTarea',
    'Identificador de la asignación a modificar.',
  )
  @ApiEnvelopeOk('Asignación modificada correctamente.')
  @Patch(':idAsignacionTarea')
  modificar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
    @Body() dto: ModificarAsignacionObraFinaBodyDto,
  ) {
    const command: ModificarAsignacionObraFinaDto = {
      ...dto,
      idAsignacionTarea,
    };

    return this.asignacionTareasObraFinaService.modificar(command);
  }
}
