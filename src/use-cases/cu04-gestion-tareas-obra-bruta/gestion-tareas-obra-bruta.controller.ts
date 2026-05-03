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
import { GestionTareasObraBrutaService } from './gestion-tareas-obra-bruta.service';
import {
  EliminarTareaObraBrutaDto,
  ListarTareasObraBrutaDto,
  ModificarTareaObraBrutaDto,
  RegistrarTareaObraBrutaDto,
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

class ModificarTareaObraBrutaBodyDto {
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

@ApiTags('CU04 - Tareas Obra Bruta')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO, RolUsuario.INGENIERO)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu04/tareas-obra-bruta')
export class GestionTareasObraBrutaController {
  constructor(
    private readonly gestionTareasObraBrutaService: GestionTareasObraBrutaService,
  ) {}

  @ApiOperation({
    summary: 'Verificar estado del módulo de tareas de obra bruta',
  })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.gestionTareasObraBrutaService.check();
  }

  @ApiOperation({ summary: 'Registrar tarea de obra bruta' })
  @ApiEnvelopeCreated('Tarea de obra bruta registrada correctamente.')
  @Post()
  registrar(@Body() dto: RegistrarTareaObraBrutaDto) {
    return this.gestionTareasObraBrutaService.registrar(dto);
  }

  @ApiOperation({ summary: 'Listar tareas de obra bruta' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Tareas de obra bruta listadas correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarTareasObraBrutaDto) {
    return this.gestionTareasObraBrutaService.listar(dto);
  }

  @ApiOperation({ summary: 'Modificar tarea de obra bruta' })
  @ApiNumericParam('idTarea', 'Identificador de la tarea a modificar.')
  @ApiEnvelopeOk('Tarea de obra bruta modificada correctamente.')
  @Patch(':idTarea')
  modificar(
    @Param('idTarea', ParseIntPipe) idTarea: number,
    @Body() dto: ModificarTareaObraBrutaBodyDto,
  ) {
    const command: ModificarTareaObraBrutaDto = {
      ...dto,
      idTarea,
    };

    return this.gestionTareasObraBrutaService.modificar(command);
  }

  @ApiOperation({ summary: 'Eliminar tarea de obra bruta' })
  @ApiNumericParam('idTarea', 'Identificador de la tarea a eliminar.')
  @ApiEnvelopeOk('Tarea de obra bruta eliminada correctamente.')
  @Delete(':idTarea')
  eliminar(@Param('idTarea', ParseIntPipe) idTarea: number) {
    const dto: EliminarTareaObraBrutaDto = { idTarea };
    return this.gestionTareasObraBrutaService.eliminar(dto);
  }
}
