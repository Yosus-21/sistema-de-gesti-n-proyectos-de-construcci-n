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
import { GestionarClientesService } from './gestionar-clientes.service';
import {
  ConsultarClienteDto,
  EliminarClienteDto,
  ListarClientesDto,
  ModificarClienteDto,
  RegistrarClienteDto,
} from './dto';

@Controller('cu01/clientes')
export class GestionarClientesController {
  constructor(
    private readonly gestionarClientesService: GestionarClientesService,
  ) {}

  @Get('health')
  check() {
    return this.gestionarClientesService.check();
  }

  @Post()
  registrar(@Body() dto: RegistrarClienteDto) {
    return this.gestionarClientesService.registrar(dto);
  }

  @Get()
  listar(@Query() dto: ListarClientesDto) {
    return this.gestionarClientesService.listar(dto);
  }

  @Get(':idCliente')
  consultar(@Param('idCliente', ParseIntPipe) idCliente: number) {
    const dto: ConsultarClienteDto = { idCliente };
    return this.gestionarClientesService.consultar(dto);
  }

  @Patch(':idCliente')
  modificar(
    @Param('idCliente', ParseIntPipe) idCliente: number,
    @Body() dto: Omit<ModificarClienteDto, 'idCliente'>,
  ) {
    return this.gestionarClientesService.modificar({
      ...dto,
      idCliente,
    });
  }

  @Delete(':idCliente')
  eliminar(@Param('idCliente', ParseIntPipe) idCliente: number) {
    const dto: EliminarClienteDto = { idCliente };
    return this.gestionarClientesService.eliminar(dto);
  }
}
