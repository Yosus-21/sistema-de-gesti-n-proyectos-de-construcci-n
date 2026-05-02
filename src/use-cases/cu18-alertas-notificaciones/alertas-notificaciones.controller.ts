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
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MetodoNotificacion } from '../../domain/enums';
import { AlertasNotificacionesService } from './alertas-notificaciones.service';
import {
  ActivarAlertaDto,
  ConfigurarAlertaDto,
  ConsultarAlertaDto,
  DesactivarAlertaDto,
  GenerarNotificacionDto,
  ListarAlertasDto,
} from './dto';

class GenerarNotificacionBodyDto implements Omit<
  GenerarNotificacionDto,
  'idAlerta'
> {
  @IsOptional()
  @IsString()
  mensajeNotificacion?: string;

  @IsOptional()
  @IsEnum(MetodoNotificacion)
  metodoNotificacion?: MetodoNotificacion;
}

@Controller('cu18/alertas-notificaciones')
export class AlertasNotificacionesController {
  constructor(
    private readonly alertasNotificacionesService: AlertasNotificacionesService,
  ) {}

  @Get('health')
  check() {
    return this.alertasNotificacionesService.check();
  }

  @Post()
  configurar(@Body() dto: ConfigurarAlertaDto) {
    return this.alertasNotificacionesService.configurar(dto);
  }

  @Get()
  listar(@Query() dto: ListarAlertasDto) {
    return this.alertasNotificacionesService.listar(dto);
  }

  @Patch(':idAlerta/activar')
  activar(@Param('idAlerta', ParseIntPipe) idAlerta: number) {
    const dto: ActivarAlertaDto = { idAlerta };
    return this.alertasNotificacionesService.activar(dto);
  }

  @Patch(':idAlerta/desactivar')
  desactivar(@Param('idAlerta', ParseIntPipe) idAlerta: number) {
    const dto: DesactivarAlertaDto = { idAlerta };
    return this.alertasNotificacionesService.desactivar(dto);
  }

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

  @Get(':idAlerta')
  consultar(@Param('idAlerta', ParseIntPipe) idAlerta: number) {
    const dto: ConsultarAlertaDto = { idAlerta };
    return this.alertasNotificacionesService.consultar(dto);
  }
}
