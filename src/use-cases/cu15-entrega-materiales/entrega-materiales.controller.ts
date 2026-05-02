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
import { EntregaMaterialesService } from './entrega-materiales.service';
import {
  ConfirmarRecepcionMaterialDto,
  ConsultarEntregaMaterialDto,
  ListarEntregasMaterialDto,
  RegistrarEntregaMaterialDto,
  VerificarEntregaContraOrdenDto,
} from './dto';

@Controller('cu15/entregas-materiales')
export class EntregaMaterialesController {
  constructor(
    private readonly entregaMaterialesService: EntregaMaterialesService,
  ) {}

  @Get('health')
  check() {
    return this.entregaMaterialesService.check();
  }

  @Post()
  registrar(@Body() dto: RegistrarEntregaMaterialDto) {
    return this.entregaMaterialesService.registrar(dto);
  }

  @Get()
  listar(@Query() dto: ListarEntregasMaterialDto) {
    return this.entregaMaterialesService.listar(dto);
  }

  @Patch(':idEntregaMaterial/confirmar-recepcion')
  confirmarRecepcion(
    @Param('idEntregaMaterial', ParseIntPipe) idEntregaMaterial: number,
  ) {
    const dto: ConfirmarRecepcionMaterialDto = { idEntregaMaterial };
    return this.entregaMaterialesService.confirmarRecepcion(dto);
  }

  @Get(':idEntregaMaterial/verificar-contra-orden/:idOrdenCompra')
  verificarContraOrden(
    @Param('idEntregaMaterial', ParseIntPipe) idEntregaMaterial: number,
    @Param('idOrdenCompra', ParseIntPipe) idOrdenCompra: number,
  ) {
    const dto: VerificarEntregaContraOrdenDto = {
      idEntregaMaterial,
      idOrdenCompra,
    };

    return this.entregaMaterialesService.verificarContraOrden(dto);
  }

  @Get(':idEntregaMaterial')
  consultar(
    @Param('idEntregaMaterial', ParseIntPipe) idEntregaMaterial: number,
  ) {
    const dto: ConsultarEntregaMaterialDto = { idEntregaMaterial };
    return this.entregaMaterialesService.consultar(dto);
  }
}
