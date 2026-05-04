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
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { RolUsuario, TipoMaterial } from '../../domain';
import { JwtAuthGuard, Public, Roles, RolesGuard } from '../../auth';
import { RegistroMaterialesService } from './registro-materiales.service';
import {
  ActualizarStockMaterialDto,
  ConsultarMaterialDto,
  EliminarMaterialDto,
  ListarMaterialesDto,
  ModificarMaterialDto,
  RegistrarMaterialDto,
  VerificarDisponibilidadMaterialDto,
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

class ModificarMaterialBodyDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  nombre?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  descripcion?: string;

  @IsOptional()
  @IsEnum(TipoMaterial)
  @ApiPropertyOptional()
  tipoMaterial?: TipoMaterial;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  unidad?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  cantidadDisponible?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiPropertyOptional()
  costoUnitario?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  especificacionesTecnicas?: string;
}

class ActualizarStockMaterialBodyDto {
  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  cantidad: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  motivo?: string;
}

class VerificarDisponibilidadMaterialQueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  cantidadRequerida: number;
}

@ApiTags('CU12 - Materiales')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.ENCARGADO_COMPRAS)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu12/materiales')
export class RegistroMaterialesController {
  constructor(
    private readonly registroMaterialesService: RegistroMaterialesService,
  ) {}

  @ApiOperation({ summary: 'Verificar estado del módulo de materiales' })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.registroMaterialesService.check();
  }

  @ApiOperation({ summary: 'Registrar material' })
  @ApiEnvelopeCreated('Material registrado correctamente.')
  @Post()
  registrar(@Body() dto: RegistrarMaterialDto) {
    return this.registroMaterialesService.registrar(dto);
  }

  @ApiOperation({ summary: 'Listar materiales' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Materiales listados correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarMaterialesDto) {
    return this.registroMaterialesService.listar(dto);
  }

  @ApiOperation({ summary: 'Actualizar stock de material' })
  @ApiNumericParam('idMaterial', 'Identificador del material a ajustar.')
  @ApiEnvelopeOk('Stock actualizado correctamente.')
  @Patch(':idMaterial/stock')
  actualizarStock(
    @Param('idMaterial', ParseIntPipe) idMaterial: number,
    @Body() dto: ActualizarStockMaterialBodyDto,
  ) {
    const command: ActualizarStockMaterialDto = {
      ...dto,
      idMaterial,
    };

    return this.registroMaterialesService.actualizarStock(command);
  }

  @ApiOperation({ summary: 'Verificar disponibilidad de material' })
  @ApiNumericParam('idMaterial', 'Identificador del material a verificar.')
  @ApiQuery({
    name: 'cantidadRequerida',
    required: true,
    type: Number,
    example: 25,
    description: 'Cantidad solicitada para validar disponibilidad inmediata.',
  })
  @ApiEnvelopeOk('Disponibilidad del material verificada correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.LECTOR,
  )
  @Get(':idMaterial/disponibilidad')
  verificarDisponibilidad(
    @Param('idMaterial', ParseIntPipe) idMaterial: number,
    @Query() query: VerificarDisponibilidadMaterialQueryDto,
  ) {
    const dto: VerificarDisponibilidadMaterialDto = {
      ...query,
      idMaterial,
    };

    return this.registroMaterialesService.verificarDisponibilidad(dto);
  }

  @ApiOperation({ summary: 'Consultar material por identificador' })
  @ApiNumericParam('idMaterial', 'Identificador del material a consultar.')
  @ApiEnvelopeOk('Material consultado correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.LECTOR,
  )
  @Get(':idMaterial')
  consultar(@Param('idMaterial', ParseIntPipe) idMaterial: number) {
    const dto: ConsultarMaterialDto = { idMaterial };
    return this.registroMaterialesService.consultar(dto);
  }

  @ApiOperation({ summary: 'Modificar material' })
  @ApiNumericParam('idMaterial', 'Identificador del material a modificar.')
  @ApiEnvelopeOk('Material modificado correctamente.')
  @Patch(':idMaterial')
  modificar(
    @Param('idMaterial', ParseIntPipe) idMaterial: number,
    @Body() dto: ModificarMaterialBodyDto,
  ) {
    const command: ModificarMaterialDto = {
      ...dto,
      idMaterial,
    };

    return this.registroMaterialesService.modificar(command);
  }

  @ApiOperation({ summary: 'Eliminar material' })
  @ApiNumericParam('idMaterial', 'Identificador del material a eliminar.')
  @ApiEnvelopeOk('Material eliminado correctamente.')
  @Roles(RolUsuario.ADMIN)
  @Delete(':idMaterial')
  eliminar(@Param('idMaterial', ParseIntPipe) idMaterial: number) {
    const dto: EliminarMaterialDto = { idMaterial };
    return this.registroMaterialesService.eliminar(dto);
  }
}
