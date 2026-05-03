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
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OcupacionTrabajador, RolUsuario } from '../../domain';
import { JwtAuthGuard, Public, Roles, RolesGuard } from '../../auth';
import { GestionTrabajadorService } from './gestion-trabajador.service';
import {
  ConsultarTrabajadorDto,
  EliminarTrabajadorDto,
  ListarTrabajadoresDto,
  ModificarTrabajadorDto,
  RegistrarTrabajadorDto,
  VerificarDisponibilidadTrabajadorDto,
} from './dto';
import {
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiEnvelopeCreated,
  ApiEnvelopeOk,
  ApiNumericParam,
  ApiPaginationQueries,
  ApiProtectedResource,
  ApiStandardErrorResponses,
} from '../../common';

class ModificarTrabajadorBodyDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  nombre?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  ci?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  telefono?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  correo?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  licenciaProfesional?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  aniosExperiencia?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  especializaciones?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  certificaciones?: string;

  @IsOptional()
  @IsEnum(OcupacionTrabajador)
  @ApiPropertyOptional()
  ocupacion?: OcupacionTrabajador;
}

class VerificarDisponibilidadTrabajadorQueryDto {
  @IsDateString()
  @ApiProperty()
  fechaInicio: string;

  @IsDateString()
  @ApiProperty()
  fechaFin: string;
}

@ApiTags('CU08 - Trabajadores')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu08/trabajadores')
export class GestionTrabajadorController {
  constructor(
    private readonly gestionTrabajadorService: GestionTrabajadorService,
  ) {}

  @ApiOperation({ summary: 'Verificar estado del módulo de trabajadores' })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.gestionTrabajadorService.check();
  }

  @ApiOperation({ summary: 'Registrar trabajador' })
  @ApiEnvelopeCreated('Trabajador registrado correctamente.')
  @Post()
  registrar(@Body() dto: RegistrarTrabajadorDto) {
    return this.gestionTrabajadorService.registrar(dto);
  }

  @ApiOperation({ summary: 'Listar trabajadores' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Trabajadores listados correctamente.')
  @Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO, RolUsuario.LECTOR)
  @Get()
  listar(@Query() dto: ListarTrabajadoresDto) {
    return this.gestionTrabajadorService.listar(dto);
  }

  @ApiOperation({ summary: 'Verificar disponibilidad de trabajador' })
  @ApiNumericParam('idTrabajador', 'Identificador del trabajador a verificar.')
  @ApiQuery({
    name: 'fechaInicio',
    required: true,
    type: String,
    example: '2026-05-10',
    description: 'Fecha de inicio del rango a evaluar.',
  })
  @ApiQuery({
    name: 'fechaFin',
    required: true,
    type: String,
    example: '2026-05-20',
    description: 'Fecha de fin del rango a evaluar.',
  })
  @ApiEnvelopeOk('Disponibilidad del trabajador verificada correctamente.')
  @Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO, RolUsuario.LECTOR)
  @Get(':idTrabajador/disponibilidad')
  verificarDisponibilidad(
    @Param('idTrabajador', ParseIntPipe) idTrabajador: number,
    @Query() query: VerificarDisponibilidadTrabajadorQueryDto,
  ) {
    const dto: VerificarDisponibilidadTrabajadorDto = {
      ...query,
      idTrabajador,
    };

    return this.gestionTrabajadorService.verificarDisponibilidad(dto);
  }

  @ApiOperation({ summary: 'Consultar trabajador por identificador' })
  @ApiNumericParam('idTrabajador', 'Identificador del trabajador a consultar.')
  @ApiEnvelopeOk('Trabajador consultado correctamente.')
  @Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO, RolUsuario.LECTOR)
  @Get(':idTrabajador')
  consultar(@Param('idTrabajador', ParseIntPipe) idTrabajador: number) {
    const dto: ConsultarTrabajadorDto = { idTrabajador };
    return this.gestionTrabajadorService.consultar(dto);
  }

  @ApiOperation({ summary: 'Modificar trabajador' })
  @ApiNumericParam('idTrabajador', 'Identificador del trabajador a modificar.')
  @ApiEnvelopeOk('Trabajador modificado correctamente.')
  @Patch(':idTrabajador')
  modificar(
    @Param('idTrabajador', ParseIntPipe) idTrabajador: number,
    @Body() dto: ModificarTrabajadorBodyDto,
  ) {
    const command: ModificarTrabajadorDto = {
      ...dto,
      idTrabajador,
    };

    return this.gestionTrabajadorService.modificar(command);
  }

  @ApiOperation({ summary: 'Eliminar trabajador' })
  @ApiNumericParam('idTrabajador', 'Identificador del trabajador a eliminar.')
  @ApiEnvelopeOk('Trabajador eliminado correctamente.')
  @Delete(':idTrabajador')
  eliminar(@Param('idTrabajador', ParseIntPipe) idTrabajador: number) {
    const dto: EliminarTrabajadorDto = { idTrabajador };
    return this.gestionTrabajadorService.eliminar(dto);
  }
}
