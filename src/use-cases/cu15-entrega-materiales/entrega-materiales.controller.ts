import {
  Body,
  Controller,
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
import { EntregaMaterialesService } from './entrega-materiales.service';
import {
  ConfirmarRecepcionMaterialDto,
  ConsultarEntregaMaterialDto,
  ListarEntregasMaterialDto,
  RegistrarEntregaMaterialDto,
  VerificarEntregaContraOrdenDto,
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

@ApiTags('CU15 - Entregas de Materiales')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.ENCARGADO_COMPRAS)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu15/entregas-materiales')
export class EntregaMaterialesController {
  constructor(
    private readonly entregaMaterialesService: EntregaMaterialesService,
  ) {}

  @ApiOperation({
    summary: 'Verificar estado del módulo de entregas de materiales',
  })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.entregaMaterialesService.check();
  }

  @ApiOperation({ summary: 'Registrar entrega de material' })
  @ApiEnvelopeCreated('Entrega registrada correctamente.')
  @Post()
  registrar(@Body() dto: RegistrarEntregaMaterialDto) {
    return this.entregaMaterialesService.registrar(dto);
  }

  @ApiOperation({ summary: 'Listar entregas de materiales' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Entregas listadas correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarEntregasMaterialDto) {
    return this.entregaMaterialesService.listar(dto);
  }

  @ApiOperation({
    summary: 'Confirmar recepción de material',
    description:
      'Marca la entrega como RECIBIDA, incrementa el stock del material y actualiza la orden de compra a RECIBIDA cuando todas sus líneas quedan completas.',
  })
  @ApiNumericParam(
    'idEntregaMaterial',
    'Identificador de la entrega a confirmar.',
  )
  @ApiEnvelopeOk('Recepción confirmada correctamente.')
  @Patch(':idEntregaMaterial/confirmar-recepcion')
  confirmarRecepcion(
    @Param('idEntregaMaterial', ParseIntPipe) idEntregaMaterial: number,
  ) {
    const dto: ConfirmarRecepcionMaterialDto = { idEntregaMaterial };
    return this.entregaMaterialesService.confirmarRecepcion(dto);
  }

  @ApiOperation({ summary: 'Verificar entrega contra orden de compra' })
  @ApiNumericParam(
    'idEntregaMaterial',
    'Identificador de la entrega a verificar.',
  )
  @ApiNumericParam(
    'idOrdenCompra',
    'Identificador de la orden de compra a contrastar.',
  )
  @ApiEnvelopeOk('Entrega verificada correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.LECTOR,
  )
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

  @ApiOperation({ summary: 'Consultar entrega por identificador' })
  @ApiNumericParam(
    'idEntregaMaterial',
    'Identificador de la entrega a consultar.',
  )
  @ApiEnvelopeOk('Entrega consultada correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.LECTOR,
  )
  @Get(':idEntregaMaterial')
  consultar(
    @Param('idEntregaMaterial', ParseIntPipe) idEntregaMaterial: number,
  ) {
    const dto: ConsultarEntregaMaterialDto = { idEntregaMaterial };
    return this.entregaMaterialesService.consultar(dto);
  }
}
