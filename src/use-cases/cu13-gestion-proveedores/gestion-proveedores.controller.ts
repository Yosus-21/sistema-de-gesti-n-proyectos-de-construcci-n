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
import { IsOptional, IsString } from 'class-validator';
import {
  ConsultarProveedorDto,
  EliminarProveedorDto,
  ListarProveedoresDto,
  ModificarProveedorDto,
  RegistrarProveedorDto,
  ValidarProveedorDto,
} from './dto';
import { GestionProveedoresService } from './gestion-proveedores.service';

class ModificarProveedorBodyDto implements Omit<
  ModificarProveedorDto,
  'idProveedor'
> {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  correo?: string;

  @IsOptional()
  @IsString()
  terminosEntrega?: string;
}

@Controller('cu13/proveedores')
export class GestionProveedoresController {
  constructor(
    private readonly gestionProveedoresService: GestionProveedoresService,
  ) {}

  @Get('health')
  check() {
    return this.gestionProveedoresService.check();
  }

  @Post()
  registrar(@Body() dto: RegistrarProveedorDto) {
    return this.gestionProveedoresService.registrar(dto);
  }

  @Get()
  listar(@Query() dto: ListarProveedoresDto) {
    return this.gestionProveedoresService.listar(dto);
  }

  @Get(':idProveedor/validar')
  validar(@Param('idProveedor', ParseIntPipe) idProveedor: number) {
    const dto: ValidarProveedorDto = { idProveedor };
    return this.gestionProveedoresService.validar(dto);
  }

  @Get(':idProveedor')
  consultar(@Param('idProveedor', ParseIntPipe) idProveedor: number) {
    const dto: ConsultarProveedorDto = { idProveedor };
    return this.gestionProveedoresService.consultar(dto);
  }

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

  @Delete(':idProveedor')
  eliminar(@Param('idProveedor', ParseIntPipe) idProveedor: number) {
    const dto: EliminarProveedorDto = { idProveedor };
    return this.gestionProveedoresService.eliminar(dto);
  }
}
