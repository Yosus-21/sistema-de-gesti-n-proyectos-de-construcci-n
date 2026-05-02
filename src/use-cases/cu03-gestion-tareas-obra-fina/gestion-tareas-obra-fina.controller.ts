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
import { GestionTareasObraFinaService } from './gestion-tareas-obra-fina.service';
import {
  EliminarTareaObraFinaDto,
  ListarTareasObraFinaDto,
  ModificarTareaObraFinaDto,
  RegistrarTareaObraFinaDto,
} from './dto';

class ModificarTareaObraFinaBodyDto {
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

@Controller('cu03/tareas-obra-fina')
export class GestionTareasObraFinaController {
  constructor(
    private readonly gestionTareasObraFinaService: GestionTareasObraFinaService,
  ) {}

  @Get('health')
  check() {
    return this.gestionTareasObraFinaService.check();
  }

  @Post()
  registrar(@Body() dto: RegistrarTareaObraFinaDto) {
    return this.gestionTareasObraFinaService.registrar(dto);
  }

  @Get()
  listar(@Query() dto: ListarTareasObraFinaDto) {
    return this.gestionTareasObraFinaService.listar(dto);
  }

  @Patch(':idTarea')
  modificar(
    @Param('idTarea', ParseIntPipe) idTarea: number,
    @Body() dto: ModificarTareaObraFinaBodyDto,
  ) {
    const command: ModificarTareaObraFinaDto = {
      ...dto,
      idTarea,
    };

    return this.gestionTareasObraFinaService.modificar(command);
  }

  @Delete(':idTarea')
  eliminar(@Param('idTarea', ParseIntPipe) idTarea: number) {
    const dto: EliminarTareaObraFinaDto = { idTarea };
    return this.gestionTareasObraFinaService.eliminar(dto);
  }
}
