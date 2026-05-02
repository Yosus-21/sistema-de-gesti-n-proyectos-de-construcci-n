import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { EstadoOrdenCompra } from '../../domain';
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

class ModificarOrdenCompraBodyDto implements Omit<
  ModificarOrdenCompraDto,
  'idOrdenCompra'
> {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProveedor?: number;

  @IsOptional()
  @IsDateString()
  fechaOrden?: string;

  @IsOptional()
  @IsDateString()
  fechaEntregaEstimada?: string;
}

class AgregarLineaOrdenCompraBodyDto implements Omit<
  AgregarLineaOrdenCompraDto,
  'idOrdenCompra'
> {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idMaterial: number;

  @Type(() => Number)
  @IsNumber()
  cantidadSolicitada: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioUnitarioAcordado: number;
}

class ActualizarEstadoOrdenCompraBodyDto implements Omit<
  ActualizarEstadoOrdenCompraDto,
  'idOrdenCompra'
> {
  @IsEnum(EstadoOrdenCompra)
  estadoOrden: EstadoOrdenCompra;
}

@Controller('cu14/ordenes-compra')
export class GestionOrdenesCompraController {
  constructor(
    private readonly gestionOrdenesCompraService: GestionOrdenesCompraService,
  ) {}

  @Get('health')
  check() {
    return this.gestionOrdenesCompraService.check();
  }

  @Post()
  crear(@Body() dto: CrearOrdenCompraDto) {
    return this.gestionOrdenesCompraService.crear(dto);
  }

  @Get()
  listar(@Query() dto: ListarOrdenesCompraDto) {
    return this.gestionOrdenesCompraService.listar(dto);
  }

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

  @Get(':idOrdenCompra/monto-total')
  calcularMontoTotal(
    @Param('idOrdenCompra', ParseIntPipe) idOrdenCompra: number,
  ) {
    const dto: CalcularMontoTotalOrdenCompraDto = { idOrdenCompra };
    return this.gestionOrdenesCompraService.calcularMontoTotal(dto);
  }

  @Get(':idOrdenCompra')
  consultar(@Param('idOrdenCompra', ParseIntPipe) idOrdenCompra: number) {
    const dto: ConsultarOrdenCompraDto = { idOrdenCompra };
    return this.gestionOrdenesCompraService.consultar(dto);
  }

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
