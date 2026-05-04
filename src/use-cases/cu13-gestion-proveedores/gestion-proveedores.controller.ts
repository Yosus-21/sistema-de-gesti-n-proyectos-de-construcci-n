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
import { IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard, Public, Roles, RolesGuard } from '../../auth';
import {
  ConsultarProveedorDto,
  EliminarProveedorDto,
  ListarProveedoresDto,
  ModificarProveedorDto,
  RegistrarProveedorDto,
  ValidarProveedorDto,
} from './dto';
import { GestionProveedoresService } from './gestion-proveedores.service';
import { ApiOperation, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeCreated,
  ApiEnvelopeOk,
  ApiNumericParam,
  ApiPaginationQueries,
  ApiProtectedResource,
  ApiStandardErrorResponses,
} from '../../common';
import { RolUsuario } from '../../domain';

class ModificarProveedorBodyDto implements Omit<
  ModificarProveedorDto,
  'idProveedor'
> {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  nombre?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  direccion?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  telefono?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  correo?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  terminosEntrega?: string;
}

@ApiTags('CU13 - Proveedores')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.ENCARGADO_COMPRAS)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu13/proveedores')
export class GestionProveedoresController {
  constructor(
    private readonly gestionProveedoresService: GestionProveedoresService,
  ) {}

  @ApiOperation({ summary: 'Verificar estado del módulo de proveedores' })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.gestionProveedoresService.check();
  }

  @ApiOperation({ summary: 'Registrar proveedor' })
  @ApiEnvelopeCreated('Proveedor registrado correctamente.')
  @Post()
  registrar(@Body() dto: RegistrarProveedorDto) {
    return this.gestionProveedoresService.registrar(dto);
  }

  @ApiOperation({ summary: 'Listar proveedores' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Proveedores listados correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarProveedoresDto) {
    return this.gestionProveedoresService.listar(dto);
  }

  @ApiOperation({ summary: 'Validar proveedor' })
  @ApiNumericParam('idProveedor', 'Identificador del proveedor a validar.')
  @ApiEnvelopeOk('Proveedor validado correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.LECTOR,
  )
  @Get(':idProveedor/validar')
  validar(@Param('idProveedor', ParseIntPipe) idProveedor: number) {
    const dto: ValidarProveedorDto = { idProveedor };
    return this.gestionProveedoresService.validar(dto);
  }

  @ApiOperation({ summary: 'Consultar proveedor por identificador' })
  @ApiNumericParam('idProveedor', 'Identificador del proveedor a consultar.')
  @ApiEnvelopeOk('Proveedor consultado correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.LECTOR,
  )
  @Get(':idProveedor')
  consultar(@Param('idProveedor', ParseIntPipe) idProveedor: number) {
    const dto: ConsultarProveedorDto = { idProveedor };
    return this.gestionProveedoresService.consultar(dto);
  }

  @ApiOperation({ summary: 'Modificar proveedor' })
  @ApiNumericParam('idProveedor', 'Identificador del proveedor a modificar.')
  @ApiEnvelopeOk('Proveedor modificado correctamente.')
  @Patch(':idProveedor')
  modificar(
    @Param('idProveedor', ParseIntPipe) idProveedor: number,
    @Body() dto: ModificarProveedorBodyDto,
  ) {
    return this.gestionProveedoresService.modificar({
      ...dto,
      idProveedor,
    });
  }

  @ApiOperation({ summary: 'Eliminar proveedor' })
  @ApiNumericParam('idProveedor', 'Identificador del proveedor a eliminar.')
  @ApiEnvelopeOk('Proveedor eliminado correctamente.')
  @Roles(RolUsuario.ADMIN)
  @Delete(':idProveedor')
  eliminar(@Param('idProveedor', ParseIntPipe) idProveedor: number) {
    const dto: EliminarProveedorDto = { idProveedor };
    return this.gestionProveedoresService.eliminar(dto);
  }
}
