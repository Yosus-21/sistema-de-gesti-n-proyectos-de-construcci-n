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
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { AsignacionTareasContratistaService } from './asignacion-tareas-contratista.service';
import {
  AsignarTareaContratistaDto,
  CancelarAsignacionContratistaDto,
  ConsultarAsignacionContratistaDto,
  ListarAsignacionesContratistaDto,
  ReasignarTrabajadorContratistaDto,
} from './dto';

class ReasignarTrabajadorContratistaBodyDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idNuevoTrabajador: number;

  @IsOptional()
  @IsString()
  motivoReasignacion?: string;
}

@Controller('cu11/asignaciones-contratista')
export class AsignacionTareasContratistaController {
  constructor(
    private readonly asignacionTareasContratistaService: AsignacionTareasContratistaService,
  ) {}

  @Get('health')
  check() {
    return this.asignacionTareasContratistaService.check();
  }

  @Post()
  asignar(@Body() dto: AsignarTareaContratistaDto) {
    return this.asignacionTareasContratistaService.asignar(dto);
  }

  @Get()
  listar(@Query() dto: ListarAsignacionesContratistaDto) {
    return this.asignacionTareasContratistaService.listar(dto);
  }

  @Patch(':idAsignacionTarea/reasignar')
  reasignar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
    @Body() dto: ReasignarTrabajadorContratistaBodyDto,
  ) {
    const command: ReasignarTrabajadorContratistaDto = {
      ...dto,
      idAsignacionTarea,
    };

    return this.asignacionTareasContratistaService.reasignar(command);
  }

  @Patch(':idAsignacionTarea/cancelar')
  cancelar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
  ) {
    const dto: CancelarAsignacionContratistaDto = { idAsignacionTarea };
    return this.asignacionTareasContratistaService.cancelar(dto);
  }

  @Get(':idAsignacionTarea')
  consultar(
    @Param('idAsignacionTarea', ParseIntPipe) idAsignacionTarea: number,
  ) {
    const dto: ConsultarAsignacionContratistaDto = { idAsignacionTarea };
    return this.asignacionTareasContratistaService.consultar(dto);
  }
}
