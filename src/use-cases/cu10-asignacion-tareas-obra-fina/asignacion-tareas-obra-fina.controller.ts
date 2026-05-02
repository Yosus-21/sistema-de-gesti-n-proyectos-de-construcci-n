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
import { AsignacionTareasObraFinaService } from './asignacion-tareas-obra-fina.service';
import {
  AsignarTareaObraFinaDto,
  CancelarAsignacionObraFinaDto,
  ConsultarAsignacionObraFinaDto,
  ListarAsignacionesObraFinaDto,
  ModificarAsignacionObraFinaDto,
} from './dto';

class ModificarAsignacionObraFinaBodyDto {
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

@Controller('cu10/asignaciones-obra-fina')
export class AsignacionTareasObraFinaController {
  constructor(
    private readonly asignacionTareasObraFinaService: AsignacionTareasObraFinaService,
  ) {}

  @Get('health')
  check() {
    return this.asignacionTareasObraFinaService.check();
  }

  @Post()
  asignar(@Body() dto: AsignarTareaObraFinaDto) {
    return this.asignacionTareasObraFinaService.asignar(dto);
  }

  @Get()
  listar(@Query() dto: ListarAsignacionesObraFinaDto) {
    return this.asignacionTareasObraFinaService.listar(dto);
  }

  @Patch(':idAsignacionTarea/cancelar')
  cancelar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
  ) {
    const dto: CancelarAsignacionObraFinaDto = { idAsignacionTarea };
    return this.asignacionTareasObraFinaService.cancelar(dto);
  }

  @Get(':idAsignacionTarea')
  consultar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
  ) {
    const dto: ConsultarAsignacionObraFinaDto = { idAsignacionTarea };
    return this.asignacionTareasObraFinaService.consultar(dto);
  }

  @Patch(':idAsignacionTarea')
  modificar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
    @Body() dto: ModificarAsignacionObraFinaBodyDto,
  ) {
    const command: ModificarAsignacionObraFinaDto = {
      ...dto,
      idAsignacionTarea,
    };

    return this.asignacionTareasObraFinaService.modificar(command);
  }
}
