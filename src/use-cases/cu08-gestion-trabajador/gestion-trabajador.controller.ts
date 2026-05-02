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
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OcupacionTrabajador } from '../../domain';
import { GestionTrabajadorService } from './gestion-trabajador.service';
import {
  ConsultarTrabajadorDto,
  EliminarTrabajadorDto,
  ListarTrabajadoresDto,
  ModificarTrabajadorDto,
  RegistrarTrabajadorDto,
  VerificarDisponibilidadTrabajadorDto,
} from './dto';

class ModificarTrabajadorBodyDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  ci?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  correo?: string;

  @IsOptional()
  @IsString()
  licenciaProfesional?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  aniosExperiencia?: number;

  @IsOptional()
  @IsString()
  especializaciones?: string;

  @IsOptional()
  @IsString()
  certificaciones?: string;

  @IsOptional()
  @IsEnum(OcupacionTrabajador)
  ocupacion?: OcupacionTrabajador;
}

class VerificarDisponibilidadTrabajadorQueryDto {
  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;
}

@Controller('cu08/trabajadores')
export class GestionTrabajadorController {
  constructor(
    private readonly gestionTrabajadorService: GestionTrabajadorService,
  ) {}

  @Get('health')
  check() {
    return this.gestionTrabajadorService.check();
  }

  @Post()
  registrar(@Body() dto: RegistrarTrabajadorDto) {
    return this.gestionTrabajadorService.registrar(dto);
  }

  @Get()
  listar(@Query() dto: ListarTrabajadoresDto) {
    return this.gestionTrabajadorService.listar(dto);
  }

  @Get(':idTrabajador/disponibilidad')
  verificarDisponibilidad(
    @Param('idTrabajador', ParseIntPipe) idTrabajador: number,
    @Query() query: VerificarDisponibilidadTrabajadorQueryDto,
  ) {
    const dto: VerificarDisponibilidadTrabajadorDto = {
      ...query,
      idTrabajador,
    };

    return this.gestionTrabajadorService.verificarDisponibilidad(dto);
  }

  @Get(':idTrabajador')
  consultar(@Param('idTrabajador', ParseIntPipe) idTrabajador: number) {
    const dto: ConsultarTrabajadorDto = { idTrabajador };
    return this.gestionTrabajadorService.consultar(dto);
  }

  @Patch(':idTrabajador')
  modificar(
    @Param('idTrabajador', ParseIntPipe) idTrabajador: number,
    @Body() dto: ModificarTrabajadorBodyDto,
  ) {
    const command: ModificarTrabajadorDto = {
      ...dto,
      idTrabajador,
    };

    return this.gestionTrabajadorService.modificar(command);
  }

  @Delete(':idTrabajador')
  eliminar(@Param('idTrabajador', ParseIntPipe) idTrabajador: number) {
    const dto: EliminarTrabajadorDto = { idTrabajador };
    return this.gestionTrabajadorService.eliminar(dto);
  }
}
