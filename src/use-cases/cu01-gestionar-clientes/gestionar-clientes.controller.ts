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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, Public, Roles, RolesGuard } from '../../auth';
import { RolUsuario } from '../../domain';
import { GestionarClientesService } from './gestionar-clientes.service';
import {
  ConsultarClienteDto,
  EliminarClienteDto,
  ListarClientesDto,
  ModificarClienteDto,
  RegistrarClienteDto,
} from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeCreated,
  ApiEnvelopeOk,
  ApiNumericParam,
  ApiPaginationQueries,
  ApiProtectedResource,
  ApiStandardErrorResponses,
} from '../../common';

@ApiTags('CU01 - Clientes')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu01/clientes')
export class GestionarClientesController {
  constructor(
    private readonly gestionarClientesService: GestionarClientesService,
  ) {}

  @ApiOperation({ summary: 'Verificar estado del módulo de clientes' })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.gestionarClientesService.check();
  }

  @ApiOperation({ summary: 'Registrar cliente' })
  @ApiEnvelopeCreated('Cliente registrado correctamente.')
  @Post()
  registrar(@Body() dto: RegistrarClienteDto) {
    return this.gestionarClientesService.registrar(dto);
  }

  @ApiOperation({ summary: 'Listar clientes' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Clientes listados correctamente.')
  @Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO, RolUsuario.LECTOR)
  @Get()
  listar(@Query() dto: ListarClientesDto) {
    return this.gestionarClientesService.listar(dto);
  }

  @ApiOperation({ summary: 'Consultar cliente por identificador' })
  @ApiNumericParam('idCliente', 'Identificador del cliente a consultar.')
  @ApiEnvelopeOk('Cliente consultado correctamente.')
  @Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO, RolUsuario.LECTOR)
  @Get(':idCliente')
  consultar(@Param('idCliente', ParseIntPipe) idCliente: number) {
    const dto: ConsultarClienteDto = { idCliente };
    return this.gestionarClientesService.consultar(dto);
  }

  @ApiOperation({ summary: 'Modificar cliente' })
  @ApiNumericParam('idCliente', 'Identificador del cliente a modificar.')
  @ApiEnvelopeOk('Cliente modificado correctamente.')
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

  @ApiOperation({ summary: 'Eliminar cliente' })
  @ApiNumericParam('idCliente', 'Identificador del cliente a eliminar.')
  @ApiEnvelopeOk('Cliente eliminado correctamente.')
  @Delete(':idCliente')
  eliminar(@Param('idCliente', ParseIntPipe) idCliente: number) {
    const dto: EliminarClienteDto = { idCliente };
    return this.gestionarClientesService.eliminar(dto);
  }
}
