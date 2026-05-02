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
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OcupacionTrabajador, PrioridadTarea } from '../../domain';
import { GestionTareasObraBrutaService } from './gestion-tareas-obra-bruta.service';
import {
  EliminarTareaObraBrutaDto,
  ListarTareasObraBrutaDto,
  ModificarTareaObraBrutaDto,
  RegistrarTareaObraBrutaDto,
} from './dto';

class ModificarTareaObraBrutaBodyDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(OcupacionTrabajador)
  perfilRequerido?: OcupacionTrabajador;

  @IsOptional()
  @IsNumber()
  @Min(0)
  duracionEstimada?: number;

  @IsOptional()
  @IsDateString()
  fechaInicioPlanificada?: string;

  @IsOptional()
  @IsDateString()
  fechaFinPlanificada?: string;

  @IsOptional()
  @IsEnum(PrioridadTarea)
  prioridad?: PrioridadTarea;
}

@Controller('cu04/tareas-obra-bruta')
export class GestionTareasObraBrutaController {
  constructor(
    private readonly gestionTareasObraBrutaService: GestionTareasObraBrutaService,
  ) {}

  @Get('health')
  check() {
    return this.gestionTareasObraBrutaService.check();
  }

  @Post()
  registrar(@Body() dto: RegistrarTareaObraBrutaDto) {
    return this.gestionTareasObraBrutaService.registrar(dto);
  }

  @Get()
  listar(@Query() dto: ListarTareasObraBrutaDto) {
    return this.gestionTareasObraBrutaService.listar(dto);
  }

  @Patch(':idTarea')
  modificar(
    @Param('idTarea', ParseIntPipe) idTarea: number,
    @Body() dto: ModificarTareaObraBrutaBodyDto,
  ) {
    const command: ModificarTareaObraBrutaDto = {
      ...dto,
      idTarea,
    };

    return this.gestionTareasObraBrutaService.modificar(command);
  }

  @Delete(':idTarea')
  eliminar(@Param('idTarea', ParseIntPipe) idTarea: number) {
    const dto: EliminarTareaObraBrutaDto = { idTarea };
    return this.gestionTareasObraBrutaService.eliminar(dto);
  }
}
