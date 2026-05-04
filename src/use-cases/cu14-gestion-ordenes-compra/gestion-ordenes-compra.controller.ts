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
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoOrdenCompra, RolUsuario } from '../../domain';
import { JwtAuthGuard, Public, Roles, RolesGuard } from '../../auth';
import { GestionOrdenesCompraService } from './gestion-ordenes-compra.service';
import {
  ActualizarEstadoOrdenCompraDto,
  AgregarLineaOrdenCompraDto,
  CalcularMontoTotalOrdenCompraDto,
  ConsultarOrdenCompraDto,
  CrearOrdenCompraDto,
  ListarOrdenesCompraDto,
  ModificarOrdenCompraDto,
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

class ModificarOrdenCompraBodyDto implements Omit<
  ModificarOrdenCompraDto,
  'idOrdenCompra'
> {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional()
  idProveedor?: number;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaOrden?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaEntregaEstimada?: string;
}

class AgregarLineaOrdenCompraBodyDto implements Omit<
  AgregarLineaOrdenCompraDto,
  'idOrdenCompra'
> {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idMaterial: number;

  @Type(() => Number)
  @IsNumber()
  @ApiProperty()
  cantidadSolicitada: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty()
  precioUnitarioAcordado: number;
}

class ActualizarEstadoOrdenCompraBodyDto implements Omit<
  ActualizarEstadoOrdenCompraDto,
  'idOrdenCompra'
> {
  @IsEnum(EstadoOrdenCompra)
  @ApiProperty()
  estadoOrden: EstadoOrdenCompra;
}

@ApiTags('CU14 - Órdenes de Compra')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.ENCARGADO_COMPRAS)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu14/ordenes-compra')
export class GestionOrdenesCompraController {
  constructor(
    private readonly gestionOrdenesCompraService: GestionOrdenesCompraService,
  ) {}

  @ApiOperation({ summary: 'Verificar estado del módulo de órdenes de compra' })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.gestionOrdenesCompraService.check();
  }

  @ApiOperation({ summary: 'Crear orden de compra' })
  @ApiEnvelopeCreated('Orden de compra creada correctamente.')
  @Post()
  crear(@Body() dto: CrearOrdenCompraDto) {
    return this.gestionOrdenesCompraService.crear(dto);
  }

  @ApiOperation({ summary: 'Listar órdenes de compra' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Órdenes de compra listadas correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarOrdenesCompraDto) {
    return this.gestionOrdenesCompraService.listar(dto);
  }

  @ApiOperation({ summary: 'Agregar línea a la orden de compra' })
  @ApiNumericParam('idOrdenCompra', 'Identificador de la orden a completar.')
  @ApiEnvelopeCreated('Línea agregada correctamente.')
  @Post(':idOrdenCompra/lineas')
  agregarLinea(
    @Param('idOrdenCompra', ParseIntPipe) idOrdenCompra: number,
    @Body() dto: AgregarLineaOrdenCompraBodyDto,
  ) {
    const command: AgregarLineaOrdenCompraDto = {
      ...dto,
      idOrdenCompra,
    };

    return this.gestionOrdenesCompraService.agregarLinea(command);
  }

  @ApiOperation({ summary: 'Actualizar estado de la orden de compra' })
  @ApiNumericParam('idOrdenCompra', 'Identificador de la orden a actualizar.')
  @ApiEnvelopeOk('Estado de la orden actualizado correctamente.')
  @Patch(':idOrdenCompra/estado')
  actualizarEstado(
    @Param('idOrdenCompra', ParseIntPipe) idOrdenCompra: number,
    @Body() dto: ActualizarEstadoOrdenCompraBodyDto,
  ) {
    const command: ActualizarEstadoOrdenCompraDto = {
      ...dto,
      idOrdenCompra,
    };

    return this.gestionOrdenesCompraService.actualizarEstado(command);
  }

  @ApiOperation({ summary: 'Calcular monto total de la orden' })
  @ApiNumericParam('idOrdenCompra', 'Identificador de la orden a calcular.')
  @ApiEnvelopeOk('Monto total calculado correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.LECTOR,
  )
  @Get(':idOrdenCompra/monto-total')
  calcularMontoTotal(
    @Param('idOrdenCompra', ParseIntPipe) idOrdenCompra: number,
  ) {
    const dto: CalcularMontoTotalOrdenCompraDto = { idOrdenCompra };
    return this.gestionOrdenesCompraService.calcularMontoTotal(dto);
  }

  @ApiOperation({ summary: 'Consultar orden de compra por identificador' })
  @ApiNumericParam('idOrdenCompra', 'Identificador de la orden a consultar.')
  @ApiEnvelopeOk('Orden de compra consultada correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.LECTOR,
  )
  @Get(':idOrdenCompra')
  consultar(@Param('idOrdenCompra', ParseIntPipe) idOrdenCompra: number) {
    const dto: ConsultarOrdenCompraDto = { idOrdenCompra };
    return this.gestionOrdenesCompraService.consultar(dto);
  }

  @ApiOperation({ summary: 'Modificar orden de compra' })
  @ApiNumericParam('idOrdenCompra', 'Identificador de la orden a modificar.')
  @ApiEnvelopeOk('Orden de compra modificada correctamente.')
  @Patch(':idOrdenCompra')
  modificar(
    @Param('idOrdenCompra', ParseIntPipe) idOrdenCompra: number,
    @Body() dto: ModificarOrdenCompraBodyDto,
  ) {
    const command: ModificarOrdenCompraDto = {
      ...dto,
      idOrdenCompra,
    };

    return this.gestionOrdenesCompraService.modificar(command);
  }
}
