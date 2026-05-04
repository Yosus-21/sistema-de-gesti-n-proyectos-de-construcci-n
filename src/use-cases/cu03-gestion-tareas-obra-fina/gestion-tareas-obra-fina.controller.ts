import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, Public, Roles, RolesGuard } from '../../auth';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OcupacionTrabajador, PrioridadTarea, RolUsuario } from '../../domain';
import { GestionTareasObraFinaService } from './gestion-tareas-obra-fina.service';
import {
  EliminarTareaObraFinaDto,
  ListarTareasObraFinaDto,
  ModificarTareaObraFinaDto,
  RegistrarTareaObraFinaDto,
} from './dto';
import { ApiOperation, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeCreated,
  ApiEnvelopeOk,
  ApiNumericParam,
  ApiPaginationQueries,
  ApiProtectedResource,
  ApiStandardErrorResponses,
} from '../../common';

class ModificarTareaObraFinaBodyDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  nombre?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  descripcion?: string;

  @IsOptional()
  @IsEnum(OcupacionTrabajador)
  @ApiPropertyOptional()
  perfilRequerido?: OcupacionTrabajador;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  duracionEstimada?: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaInicioPlanificada?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaFinPlanificada?: string;

  @IsOptional()
  @IsEnum(PrioridadTarea)
  @ApiPropertyOptional()
  prioridad?: PrioridadTarea;
}

@ApiTags('CU03 - Tareas Obra Fina')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO, RolUsuario.INGENIERO)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu03/tareas-obra-fina')
export class GestionTareasObraFinaController {
  constructor(
    private readonly gestionTareasObraFinaService: GestionTareasObraFinaService,
  ) {}

  @ApiOperation({
    summary: 'Verificar estado del módulo de tareas de obra fina',
  })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.gestionTareasObraFinaService.check();
  }

  @ApiOperation({ summary: 'Registrar tarea de obra fina' })
  @ApiEnvelopeCreated('Tarea de obra fina registrada correctamente.')
  @Post()
  registrar(@Body() dto: RegistrarTareaObraFinaDto) {
    return this.gestionTareasObraFinaService.registrar(dto);
  }

  @ApiOperation({ summary: 'Listar tareas de obra fina' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Tareas de obra fina listadas correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.CONTRATISTA,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarTareasObraFinaDto) {
    return this.gestionTareasObraFinaService.listar(dto);
  }

  @ApiOperation({ summary: 'Modificar tarea de obra fina' })
  @ApiNumericParam('idTarea', 'Identificador de la tarea a modificar.')
  @ApiEnvelopeOk('Tarea de obra fina modificada correctamente.')
  @Patch(':idTarea')
  modificar(
    @Param('idTarea', ParseIntPipe) idTarea: number,
    @Body() dto: ModificarTareaObraFinaBodyDto,
  ) {
    const command: ModificarTareaObraFinaDto = {
      ...dto,
      idTarea,
    };

    return this.gestionTareasObraFinaService.modificar(command);
  }

  @ApiOperation({ summary: 'Eliminar tarea de obra fina' })
  @ApiNumericParam('idTarea', 'Identificador de la tarea a eliminar.')
  @ApiEnvelopeOk('Tarea de obra fina eliminada correctamente.')
  @Delete(':idTarea')
  eliminar(@Param('idTarea', ParseIntPipe) idTarea: number) {
    const dto: EliminarTareaObraFinaDto = { idTarea };
    return this.gestionTareasObraFinaService.eliminar(dto);
  }
}
