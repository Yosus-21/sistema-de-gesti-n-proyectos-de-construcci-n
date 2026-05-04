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
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { GestionContratoContratistaService } from './gestion-contrato-contratista.service';
import {
  CalcularCostoContratoDto,
  ConsultarContratoContratistaDto,
  ListarContratosContratistaDto,
  ModificarContratoContratistaDto,
  RegistrarContratoContratistaDto,
  ValidarVigenciaContratoDto,
} from './dto';
import {
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiQuery,
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

class DetalleContratoContratistaBodyDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idCargo?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @ApiProperty()
  cantidadPersonas: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  costoUnitarioPorDia: number;
}

class ModificarContratoContratistaBodyDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idProyecto?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idContratista?: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaFin?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  metodoPago?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  terminosYCondiciones?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleContratoContratistaBodyDto)
  @ApiPropertyOptional()
  detalles?: DetalleContratoContratistaBodyDto[];
}

class ValidarVigenciaContratoQueryDto {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaReferencia?: string;
}

@ApiTags('CU07 - Contratos Contratistas')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu07/contratos-contratistas')
export class GestionContratoContratistaController {
  constructor(
    private readonly gestionContratoContratistaService: GestionContratoContratistaService,
  ) {}

  @ApiOperation({
    summary: 'Verificar estado del módulo de contratos con contratistas',
  })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.gestionContratoContratistaService.check();
  }

  @ApiOperation({ summary: 'Registrar contrato con contratista' })
  @ApiEnvelopeCreated('Contrato registrado correctamente.')
  @Post()
  registrar(@Body() dto: RegistrarContratoContratistaDto) {
    return this.gestionContratoContratistaService.registrar(dto);
  }

  @ApiOperation({ summary: 'Listar contratos con contratistas' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Contratos listados correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.CONTRATISTA,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarContratosContratistaDto) {
    return this.gestionContratoContratistaService.listar(dto);
  }

  @ApiOperation({ summary: 'Calcular costo de contrato' })
  @ApiNumericParam('idContrato', 'Identificador del contrato a evaluar.')
  @ApiEnvelopeOk('Costo del contrato calculado correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.CONTRATISTA,
    RolUsuario.LECTOR,
  )
  @Get(':idContrato/costo')
  calcularCosto(@Param('idContrato', ParseIntPipe) idContrato: number) {
    const dto: CalcularCostoContratoDto = { idContrato };
    return this.gestionContratoContratistaService.calcularCosto(dto);
  }

  @ApiOperation({ summary: 'Validar vigencia de contrato' })
  @ApiNumericParam('idContrato', 'Identificador del contrato a validar.')
  @ApiQuery({
    name: 'fechaReferencia',
    required: false,
    type: String,
    example: '2026-05-02',
    description:
      'Fecha ISO 8601 usada como referencia para validar la vigencia.',
  })
  @ApiEnvelopeOk('Vigencia del contrato validada correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.CONTRATISTA,
    RolUsuario.LECTOR,
  )
  @Get(':idContrato/vigencia')
  validarVigencia(
    @Param('idContrato', ParseIntPipe) idContrato: number,
    @Query() query: ValidarVigenciaContratoQueryDto,
  ) {
    const dto: ValidarVigenciaContratoDto = {
      ...query,
      idContrato,
    };

    return this.gestionContratoContratistaService.validarVigencia(dto);
  }

  @ApiOperation({ summary: 'Consultar contrato por identificador' })
  @ApiNumericParam('idContrato', 'Identificador del contrato a consultar.')
  @ApiEnvelopeOk('Contrato consultado correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.CONTRATISTA,
    RolUsuario.LECTOR,
  )
  @Get(':idContrato')
  consultar(@Param('idContrato', ParseIntPipe) idContrato: number) {
    const dto: ConsultarContratoContratistaDto = { idContrato };
    return this.gestionContratoContratistaService.consultar(dto);
  }

  @ApiOperation({ summary: 'Modificar contrato con contratista' })
  @ApiNumericParam('idContrato', 'Identificador del contrato a modificar.')
  @ApiEnvelopeOk('Contrato modificado correctamente.')
  @Patch(':idContrato')
  modificar(
    @Param('idContrato', ParseIntPipe) idContrato: number,
    @Body() dto: ModificarContratoContratistaBodyDto,
  ) {
    const command: ModificarContratoContratistaDto = {
      ...dto,
      idContrato,
    };

    return this.gestionContratoContratistaService.modificar(command);
  }
}
