import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EstadoProyecto } from '../../domain';
import { CreacionProyectosService } from './creacion-proyectos.service';
import {
  ConsultarProyectoDto,
  CrearProyectoDto,
  ListarProyectosDto,
} from './dto';

@Controller('cu02/proyectos')
export class CreacionProyectosController {
  constructor(
    private readonly creacionProyectosService: CreacionProyectosService,
  ) {}

  @Get('health')
  check() {
    return this.creacionProyectosService.check();
  }

  @Post()
  crear(@Body() dto: CrearProyectoDto) {
    return this.creacionProyectosService.crear(dto);
  }

  @Get()
  listar(@Query() dto: ListarProyectosDto) {
    return this.creacionProyectosService.listar(dto);
  }

  @Get(':idProyecto')
  consultar(@Param('idProyecto', ParseIntPipe) idProyecto: number) {
    const dto: ConsultarProyectoDto = { idProyecto };
    return this.creacionProyectosService.consultar(dto);
  }

  @Patch(':idProyecto/estado')
  cambiarEstado(
    @Param('idProyecto', ParseIntPipe) idProyecto: number,
    @Body('estadoProyecto', new ParseEnumPipe(EstadoProyecto))
    estadoProyecto: EstadoProyecto,
  ) {
    return this.creacionProyectosService.cambiarEstado({
      idProyecto,
      estadoProyecto,
    });
  }
}
