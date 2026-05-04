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
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard, Public, Roles, RolesGuard } from '../../auth';
import { MetodoNotificacion, RolUsuario } from '../../domain';
import { AlertasNotificacionesService } from './alertas-notificaciones.service';
import {
  ActivarAlertaDto,
  ConfigurarAlertaDto,
  ConsultarAlertaDto,
  DesactivarAlertaDto,
  GenerarNotificacionDto,
  ListarAlertasDto,
} from './dto';
import { ApiOperation, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeCreated,
  ApiEnvelopeOk,
  ApiNumericParam,
  ApiPaginationQueries,
  ApiProtectedResource,
  ApiStandardErrorResponses,
} from '../../common';

class GenerarNotificacionBodyDto implements Omit<
  GenerarNotificacionDto,
  'idAlerta'
> {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  mensajeNotificacion?: string;

  @IsOptional()
  @IsEnum(MetodoNotificacion)
  @ApiPropertyOptional()
  metodoNotificacion?: MetodoNotificacion;

  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({
    description:
      'Obligatorio si el método es EMAIL y el entorno tiene emails habilitados',
  })
  correoDestino?: string;
}

@ApiTags('CU18 - Alertas y Notificaciones')
@ApiProtectedResource()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  RolUsuario.ADMIN,
  RolUsuario.GESTOR_PROYECTO,
  RolUsuario.INGENIERO,
  RolUsuario.ENCARGADO_COMPRAS,
)
@ApiStandardErrorResponses('badRequest', 'notFound', 'conflict')
@Controller('cu18/alertas-notificaciones')
export class AlertasNotificacionesController {
  constructor(
    private readonly alertasNotificacionesService: AlertasNotificacionesService,
  ) {}

  @ApiOperation({
    summary: 'Verificar estado del módulo de alertas y notificaciones',
  })
  @ApiEnvelopeOk('Estado del módulo obtenido correctamente.')
  @ApiOperation({ security: [] })
  @Public()
  @Get('health')
  check() {
    return this.alertasNotificacionesService.check();
  }

  @ApiOperation({ summary: 'Configurar alerta' })
  @ApiEnvelopeCreated('Alerta configurada correctamente.')
  @Post()
  configurar(@Body() dto: ConfigurarAlertaDto) {
    return this.alertasNotificacionesService.configurar(dto);
  }

  @ApiOperation({ summary: 'Listar alertas' })
  @ApiPaginationQueries()
  @ApiEnvelopeOk('Alertas listadas correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.CONTRATISTA,
    RolUsuario.LECTOR,
  )
  @Get()
  listar(@Query() dto: ListarAlertasDto) {
    return this.alertasNotificacionesService.listar(dto);
  }

  @ApiOperation({ summary: 'Activar alerta' })
  @ApiNumericParam('idAlerta', 'Identificador de la alerta a activar.')
  @ApiEnvelopeOk('Alerta activada correctamente.')
  @Patch(':idAlerta/activar')
  activar(@Param('idAlerta', ParseIntPipe) idAlerta: number) {
    const dto: ActivarAlertaDto = { idAlerta };
    return this.alertasNotificacionesService.activar(dto);
  }

  @ApiOperation({ summary: 'Desactivar alerta' })
  @ApiNumericParam('idAlerta', 'Identificador de la alerta a desactivar.')
  @ApiEnvelopeOk('Alerta desactivada correctamente.')
  @Patch(':idAlerta/desactivar')
  desactivar(@Param('idAlerta', ParseIntPipe) idAlerta: number) {
    const dto: DesactivarAlertaDto = { idAlerta };
    return this.alertasNotificacionesService.desactivar(dto);
  }

  @ApiOperation({ summary: 'Generar notificación' })
  @ApiNumericParam('idAlerta', 'Identificador de la alerta a notificar.')
  @ApiEnvelopeCreated('Notificación registrada correctamente.')
  @Post(':idAlerta/notificar')
  generarNotificacion(
    @Param('idAlerta', ParseIntPipe) idAlerta: number,
    @Body() dto: GenerarNotificacionBodyDto,
  ) {
    const command: GenerarNotificacionDto = {
      ...dto,
      idAlerta,
    };

    return this.alertasNotificacionesService.generarNotificacion(command);
  }

  @ApiOperation({ summary: 'Consultar alerta por identificador' })
  @ApiNumericParam('idAlerta', 'Identificador de la alerta a consultar.')
  @ApiEnvelopeOk('Alerta consultada correctamente.')
  @Roles(
    RolUsuario.ADMIN,
    RolUsuario.GESTOR_PROYECTO,
    RolUsuario.INGENIERO,
    RolUsuario.ENCARGADO_COMPRAS,
    RolUsuario.CONTRATISTA,
    RolUsuario.LECTOR,
  )
  @Get(':idAlerta')
  consultar(@Param('idAlerta', ParseIntPipe) idAlerta: number) {
    const dto: ConsultarAlertaDto = { idAlerta };
    return this.alertasNotificacionesService.consultar(dto);
  }
}
