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
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AsignacionTareasObraBrutaService } from './asignacion-tareas-obra-bruta.service';
import {
  AsignarTareaObraBrutaDto,
  CancelarAsignacionObraBrutaDto,
  ConsultarAsignacionObraBrutaDto,
  ListarAsignacionesObraBrutaDto,
  ModificarAsignacionObraBrutaDto,
} from './dto';

class ModificarAsignacionObraBrutaBodyDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTarea?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idTrabajador?: number;

  @IsOptional()
  @IsDateString()
  fechaAsignacion?: string;

  @IsOptional()
  @IsString()
  rolEnLaTarea?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

@Controller('cu09/asignaciones-obra-bruta')
export class AsignacionTareasObraBrutaController {
  constructor(
    private readonly asignacionTareasObraBrutaService: AsignacionTareasObraBrutaService,
  ) {}

  @Get('health')
  check() {
    return this.asignacionTareasObraBrutaService.check();
  }

  @Post()
  asignar(@Body() dto: AsignarTareaObraBrutaDto) {
    return this.asignacionTareasObraBrutaService.asignar(dto);
  }

  @Get()
  listar(@Query() dto: ListarAsignacionesObraBrutaDto) {
    return this.asignacionTareasObraBrutaService.listar(dto);
  }

  @Patch(':idAsignacionTarea/cancelar')
  cancelar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
  ) {
    const dto: CancelarAsignacionObraBrutaDto = { idAsignacionTarea };
    return this.asignacionTareasObraBrutaService.cancelar(dto);
  }

  @Get(':idAsignacionTarea')
  consultar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
  ) {
    const dto: ConsultarAsignacionObraBrutaDto = { idAsignacionTarea };
    return this.asignacionTareasObraBrutaService.consultar(dto);
  }

  @Patch(':idAsignacionTarea')
  modificar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
    @Body() dto: ModificarAsignacionObraBrutaBodyDto,
  ) {
    const command: ModificarAsignacionObraBrutaDto = {
      ...dto,
      idAsignacionTarea,
    };

    return this.asignacionTareasObraBrutaService.modificar(command);
  }
}
