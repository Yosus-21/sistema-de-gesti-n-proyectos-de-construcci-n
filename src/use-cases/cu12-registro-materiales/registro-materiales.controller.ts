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
} from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TipoMaterial } from '../../domain';
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

class ModificarMaterialBodyDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(TipoMaterial)
  tipoMaterial?: TipoMaterial;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cantidadDisponible?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costoUnitario?: number;

  @IsOptional()
  @IsString()
  especificacionesTecnicas?: string;
}

class ActualizarStockMaterialBodyDto {
  @Type(() => Number)
  @IsNumber()
  cantidad: number;

  @IsOptional()
  @IsString()
  motivo?: string;
}

class VerificarDisponibilidadMaterialQueryDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cantidadRequerida: number;
}

@Controller('cu12/materiales')
export class RegistroMaterialesController {
  constructor(
    private readonly registroMaterialesService: RegistroMaterialesService,
  ) {}

  @Get('health')
  check() {
    return this.registroMaterialesService.check();
  }

  @Post()
  registrar(@Body() dto: RegistrarMaterialDto) {
    return this.registroMaterialesService.registrar(dto);
  }

  @Get()
  listar(@Query() dto: ListarMaterialesDto) {
    return this.registroMaterialesService.listar(dto);
  }

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

  @Get(':idMaterial')
  consultar(@Param('idMaterial', ParseIntPipe) idMaterial: number) {
    const dto: ConsultarMaterialDto = { idMaterial };
    return this.registroMaterialesService.consultar(dto);
  }

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

  @Delete(':idMaterial')
  eliminar(@Param('idMaterial', ParseIntPipe) idMaterial: number) {
    const dto: EliminarMaterialDto = { idMaterial };
    return this.registroMaterialesService.eliminar(dto);
  }
}
