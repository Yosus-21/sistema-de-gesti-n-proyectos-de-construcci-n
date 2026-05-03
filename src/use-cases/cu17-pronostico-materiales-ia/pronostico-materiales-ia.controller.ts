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
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { JwtAuthGuard, Public, Roles, RolesGuard } from '../../auth';
import { RolUsuario } from '../../domain';
import { PronosticoMaterialesIaService } from './pronostico-materiales-ia.service';
import {
  AjustarPronosticoMaterialDto,
  CalcularNivelConfianzaPronosticoDto,
  ConfirmarPronosticoMaterialDto,
  GenerarPronosticoMaterialDto,
  ListarPronosticosMaterialDto,
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

class AjustarPronosticoMaterialBodyDto implements Omit<
  AjustarPronosticoMaterialDto,
  'idPronosticoMaterial'
> {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  stockMinimo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  stockMaximo?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  observaciones?: string;
}

@ApiTags('CU17 - Pronóstico Materiales IA')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  RolUsuario.ADMIN,
  RolUsuario.ENCARGADO_COMPRAS,
  RolUsuario.GESTOR_PROYECTO,
)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu17/pronostico-materiales-ia')
export class PronosticoMaterialesIaController {
  constructor(
    private readonly pronosticoMaterialesIaService: PronosticoMaterialesIaService,
  ) {}

  @ApiOperation({
    summary: 'Verificar estado del módulo de pronóstico de materiales IA',
  })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.pronosticoMaterialesIaService.check();
  }

  @ApiOperation({
    summary: 'Generar pronóstico de materiales',
    description:
      'Actualmente usa una heurística interna provisional y no integra IA externa real.',
  })
  @ApiEnvelopeCreated('Pronóstico generado correctamente.')
  @Post()
  generar(@Body() dto: GenerarPronosticoMaterialDto) {
    return this.pronosticoMaterialesIaService.generar(dto);
  }

  @ApiOperation({ summary: 'Listar pronósticos de materiales' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Pronósticos listados correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarPronosticosMaterialDto) {
    return this.pronosticoMaterialesIaService.listar(dto);
  }

  @ApiOperation({ summary: 'Ajustar pronóstico de materiales' })
  @ApiNumericParam(
    'idPronosticoMaterial',
    'Identificador del pronóstico a ajustar.',
  )
  @ApiEnvelopeOk('Pronóstico ajustado correctamente.')
  @Patch(':idPronosticoMaterial/ajustar')
  ajustar(
    @Param('idPronosticoMaterial', ParseIntPipe)
    idPronosticoMaterial: number,
    @Body() dto: AjustarPronosticoMaterialBodyDto,
  ) {
    const command: AjustarPronosticoMaterialDto = {
      ...dto,
      idPronosticoMaterial,
    };

    return this.pronosticoMaterialesIaService.ajustar(command);
  }

  @ApiOperation({ summary: 'Confirmar pronóstico de materiales' })
  @ApiNumericParam(
    'idPronosticoMaterial',
    'Identificador del pronóstico a confirmar.',
  )
  @ApiEnvelopeOk('Pronóstico confirmado correctamente.')
  @Patch(':idPronosticoMaterial/confirmar')
  confirmar(
    @Param('idPronosticoMaterial', ParseIntPipe)
    idPronosticoMaterial: number,
  ) {
    const dto: ConfirmarPronosticoMaterialDto = { idPronosticoMaterial };
    return this.pronosticoMaterialesIaService.confirmar(dto);
  }

  @ApiOperation({
    summary: 'Calcular nivel de confianza del pronóstico',
    description:
      'El cálculo actual usa una heurística local y no un modelo predictivo externo.',
  })
  @ApiNumericParam(
    'idPronosticoMaterial',
    'Identificador del pronóstico a evaluar.',
  )
  @ApiEnvelopeOk('Nivel de confianza calculado correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.LECTOR,
  )
  @Get(':idPronosticoMaterial/confianza')
  calcularNivelConfianza(
    @Param('idPronosticoMaterial', ParseIntPipe)
    idPronosticoMaterial: number,
  ) {
    const dto: CalcularNivelConfianzaPronosticoDto = {
      idPronosticoMaterial,
    };

    return this.pronosticoMaterialesIaService.calcularNivelConfianza(dto);
  }
}
