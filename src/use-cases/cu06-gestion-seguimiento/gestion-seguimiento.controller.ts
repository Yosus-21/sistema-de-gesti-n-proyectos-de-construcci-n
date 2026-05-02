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
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { GestionSeguimientoService } from './gestion-seguimiento.service';
import {
  CalcularDesviacionDto,
  ConsultarSeguimientoDto,
  ListarSeguimientosDto,
  ModificarSeguimientoDto,
  RegistrarSeguimientoDto,
} from './dto';

class ModificarSeguimientoBodyDto {
  @IsOptional()
  @IsDateString()
  fechaSeguimiento?: string;

  @IsOptional()
  @IsString()
  estadoReportado?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidadMaterialUsado?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  porcentajeAvance?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

@Controller('cu06/seguimientos')
export class GestionSeguimientoController {
  constructor(
    private readonly gestionSeguimientoService: GestionSeguimientoService,
  ) {}

  @Get('health')
  check() {
    return this.gestionSeguimientoService.check();
  }

  @Post()
  registrar(@Body() dto: RegistrarSeguimientoDto) {
    return this.gestionSeguimientoService.registrar(dto);
  }

  @Get()
  listar(@Query() dto: ListarSeguimientosDto) {
    return this.gestionSeguimientoService.listar(dto);
  }

  @Get('tareas/:idTarea/desviacion')
  calcularDesviacion(@Param('idTarea', ParseIntPipe) idTarea: number) {
    const dto: CalcularDesviacionDto = { idTarea };
    return this.gestionSeguimientoService.calcularDesviacion(dto);
  }

  @Get(':idSeguimiento')
  consultar(@Param('idSeguimiento', ParseIntPipe) idSeguimiento: number) {
    const dto: ConsultarSeguimientoDto = { idSeguimiento };
    return this.gestionSeguimientoService.consultar(dto);
  }

  @Patch(':idSeguimiento')
  modificar(
    @Param('idSeguimiento', ParseIntPipe) idSeguimiento: number,
    @Body() dto: ModificarSeguimientoBodyDto,
  ) {
    const command: ModificarSeguimientoDto = {
      ...dto,
      idSeguimiento,
    };

    return this.gestionSeguimientoService.modificar(command);
  }
}
