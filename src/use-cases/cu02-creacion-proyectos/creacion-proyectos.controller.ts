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
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, Public, Roles, RolesGuard } from '../../auth';
import { EstadoProyecto, RolUsuario } from '../../domain';
import { CreacionProyectosService } from './creacion-proyectos.service';
import {
  ConsultarProyectoDto,
  CrearProyectoDto,
  ListarProyectosDto,
} from './dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeCreated,
  ApiEnvelopeOk,
  ApiNumericParam,
  ApiPaginationQueries,
  ApiProtectedResource,
  ApiStandardErrorResponses,
} from '../../common';

@ApiTags('CU02 - Proyectos')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.GESTOR_PROYECTO, RolUsuario.INGENIERO)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu02/proyectos')
export class CreacionProyectosController {
  constructor(
    private readonly creacionProyectosService: CreacionProyectosService,
  ) {}

  @ApiOperation({ summary: 'Verificar estado del módulo de proyectos' })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.creacionProyectosService.check();
  }

  @ApiOperation({ summary: 'Crear proyecto' })
  @ApiEnvelopeCreated('Proyecto creado correctamente.')
  @Post()
  crear(@Body() dto: CrearProyectoDto) {
    return this.creacionProyectosService.crear(dto);
  }

  @ApiOperation({ summary: 'Listar proyectos' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Proyectos listados correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarProyectosDto) {
    return this.creacionProyectosService.listar(dto);
  }

  @ApiOperation({ summary: 'Consultar proyecto por identificador' })
  @ApiNumericParam('idProyecto', 'Identificador del proyecto a consultar.')
  @ApiEnvelopeOk('Proyecto consultado correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.LECTOR,
  )
  @Get(':idProyecto')
  consultar(@Param('idProyecto', ParseIntPipe) idProyecto: number) {
    const dto: ConsultarProyectoDto = { idProyecto };
    return this.creacionProyectosService.consultar(dto);
  }

  @ApiOperation({ summary: 'Cambiar estado del proyecto' })
  @ApiNumericParam('idProyecto', 'Identificador del proyecto a actualizar.')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        estadoProyecto: {
          type: 'string',
          enum: Object.values(EstadoProyecto),
          example: 'EN_EJECUCION',
          description: 'Nuevo estado del proyecto.',
        },
      },
      required: ['estadoProyecto'],
    },
  })
  @ApiEnvelopeOk('Estado del proyecto actualizado correctamente.')
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
