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
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RolUsuario } from '../../domain';
import { CreacionCronogramaService } from './creacion-cronograma.service';
import {
  ConsultarCronogramaDto,
  CrearCronogramaDto,
  ListarCronogramasDto,
  ReplanificarCronogramaDto,
} from './dto';
import {
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
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

class ReplanificarCronogramaBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  motivoReplanificacion: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  nuevasAccionesAnteRetraso?: string;
}

@ApiTags('CU05 - Cronogramas')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO, RolUsuario.INGENIERO)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu05/cronogramas')
export class CreacionCronogramaController {
  constructor(
    private readonly creacionCronogramaService: CreacionCronogramaService,
  ) {}

  @ApiOperation({ summary: 'Verificar estado del módulo de cronogramas' })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.creacionCronogramaService.check();
  }

  @ApiOperation({ summary: 'Crear cronograma' })
  @ApiEnvelopeCreated('Cronograma creado correctamente.')
  @Post()
  crear(@Body() dto: CrearCronogramaDto) {
    return this.creacionCronogramaService.crear(dto);
  }

  @ApiOperation({ summary: 'Listar cronogramas' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Cronogramas listados correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarCronogramasDto) {
    return this.creacionCronogramaService.listar(dto);
  }

  @ApiOperation({ summary: 'Consultar cronograma por identificador' })
  @ApiNumericParam('idCronograma', 'Identificador del cronograma a consultar.')
  @ApiEnvelopeOk('Cronograma consultado correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.LECTOR,
  )
  @Get(':idCronograma')
  consultar(@Param('idCronograma', ParseIntPipe) idCronograma: number) {
    const dto: ConsultarCronogramaDto = { idCronograma };
    return this.creacionCronogramaService.consultar(dto);
  }

  @ApiOperation({ summary: 'Replanificar cronograma' })
  @ApiNumericParam(
    'idCronograma',
    'Identificador del cronograma a replanificar.',
  )
  @ApiEnvelopeOk('Cronograma replanificado correctamente.')
  @Patch(':idCronograma/replanificar')
  replanificar(
    @Param('idCronograma', ParseIntPipe) idCronograma: number,
    @Body() dto: ReplanificarCronogramaBodyDto,
  ) {
    const command: ReplanificarCronogramaDto = {
      ...dto,
      idCronograma,
    };

    return this.creacionCronogramaService.replanificar(command);
  }
}
