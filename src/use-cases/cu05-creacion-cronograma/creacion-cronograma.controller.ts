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
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreacionCronogramaService } from './creacion-cronograma.service';
import {
  ConsultarCronogramaDto,
  CrearCronogramaDto,
  ListarCronogramasDto,
  ReplanificarCronogramaDto,
} from './dto';

class ReplanificarCronogramaBodyDto {
  @IsString()
  @IsNotEmpty()
  motivoReplanificacion: string;

  @IsOptional()
  @IsString()
  nuevasAccionesAnteRetraso?: string;
}

@Controller('cu05/cronogramas')
export class CreacionCronogramaController {
  constructor(
    private readonly creacionCronogramaService: CreacionCronogramaService,
  ) {}

  @Get('health')
  check() {
    return this.creacionCronogramaService.check();
  }

  @Post()
  crear(@Body() dto: CrearCronogramaDto) {
    return this.creacionCronogramaService.crear(dto);
  }

  @Get()
  listar(@Query() dto: ListarCronogramasDto) {
    return this.creacionCronogramaService.listar(dto);
  }

  @Get(':idCronograma')
  consultar(@Param('idCronograma', ParseIntPipe) idCronograma: number) {
    const dto: ConsultarCronogramaDto = { idCronograma };
    return this.creacionCronogramaService.consultar(dto);
  }

  @Patch(':idCronograma/replanificar')
  replanificar(
    @Param('idCronograma', ParseIntPipe) idCronograma: number,
    @Body() dto: ReplanificarCronogramaBodyDto,
  ) {
    const command: ReplanificarCronogramaDto = {
      ...dto,
      idCronograma,
    };

    return this.creacionCronogramaService.replanificar(command);
  }
}
