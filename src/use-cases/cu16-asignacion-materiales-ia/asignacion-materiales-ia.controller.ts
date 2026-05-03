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
import { AsignacionMaterialesIaService } from './asignacion-materiales-ia.service';
import {
  AjustarAsignacionMaterialDto,
  ConfirmarAsignacionMaterialDto,
  GenerarPropuestaAsignacionMaterialDto,
  ListarAsignacionesMaterialDto,
  ValidarRestriccionesAsignacionMaterialDto,
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

class AjustarAsignacionMaterialBodyDto implements Omit<
  AjustarAsignacionMaterialDto,
  'idAsignacionMaterial'
> {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  cantidadAsignada?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  costoMaximoPermitido?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  restricciones?: string;
}

@ApiTags('CU16 - Asignación Materiales IA')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.ENCARGADO_COMPRAS)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu16/asignacion-materiales-ia')
export class AsignacionMaterialesIaController {
  constructor(
    private readonly asignacionMaterialesIaService: AsignacionMaterialesIaService,
  ) {}

  @ApiOperation({
    summary: 'Verificar estado del módulo de asignación de materiales IA',
  })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.asignacionMaterialesIaService.check();
  }

  @ApiOperation({
    summary: 'Generar propuesta de asignación de materiales',
    description:
      'Actualmente usa una heurística interna provisional y no integra IA externa real.',
  })
  @ApiEnvelopeCreated('Propuesta generada correctamente.')
  @Post('propuestas')
  generarPropuesta(@Body() dto: GenerarPropuestaAsignacionMaterialDto) {
    return this.asignacionMaterialesIaService.generarPropuesta(dto);
  }

  @ApiOperation({ summary: 'Listar asignaciones de materiales IA' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Asignaciones listadas correctamente.')
  @Roles(RolUsuario.ADMIN, RolUsuario.ENCARGADO_COMPRAS, RolUsuario.LECTOR)
  @Get()
  listar(@Query() dto: ListarAsignacionesMaterialDto) {
    return this.asignacionMaterialesIaService.listar(dto);
  }

  @ApiOperation({
    summary: 'Validar restricciones de asignación',
    description:
      'La validación actual es heurística y local; no consume servicios externos de IA.',
  })
  @ApiEnvelopeCreated('Restricciones validadas correctamente.')
  @Post('validar-restricciones')
  validarRestricciones(@Body() dto: ValidarRestriccionesAsignacionMaterialDto) {
    return this.asignacionMaterialesIaService.validarRestricciones(dto);
  }

  @ApiOperation({ summary: 'Confirmar asignación de material' })
  @ApiNumericParam(
    'idAsignacionMaterial',
    'Identificador de la asignación a confirmar.',
  )
  @ApiEnvelopeOk('Asignación confirmada correctamente.')
  @Patch(':idAsignacionMaterial/confirmar')
  confirmar(
    @Param('idAsignacionMaterial', ParseIntPipe)
    idAsignacionMaterial: number,
  ) {
    const dto: ConfirmarAsignacionMaterialDto = { idAsignacionMaterial };
    return this.asignacionMaterialesIaService.confirmar(dto);
  }

  @ApiOperation({ summary: 'Ajustar asignación de material' })
  @ApiNumericParam(
    'idAsignacionMaterial',
    'Identificador de la asignación a ajustar.',
  )
  @ApiEnvelopeOk('Asignación ajustada correctamente.')
  @Patch(':idAsignacionMaterial/ajustar')
  ajustar(
    @Param('idAsignacionMaterial', ParseIntPipe)
    idAsignacionMaterial: number,
    @Body() dto: AjustarAsignacionMaterialBodyDto,
  ) {
    const command: AjustarAsignacionMaterialDto = {
      ...dto,
      idAsignacionMaterial,
    };

    return this.asignacionMaterialesIaService.ajustar(command);
  }
}
