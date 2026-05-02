import { Injectable } from '@nestjs/common';
import {
  ActivarAlertaDto,
  ConfigurarAlertaDto,
  ConsultarAlertaDto,
  DesactivarAlertaDto,
  GenerarNotificacionDto,
  ListarAlertasDto,
} from './dto';
import {
  ActivarAlertaUseCase,
  ConfigurarAlertaUseCase,
  ConsultarAlertaUseCase,
  DesactivarAlertaUseCase,
  GenerarNotificacionUseCase,
  ListarAlertasUseCase,
} from './handlers';

@Injectable()
export class AlertasNotificacionesService {
  constructor(
    private readonly configurarAlertaUseCase: ConfigurarAlertaUseCase,
    private readonly activarAlertaUseCase: ActivarAlertaUseCase,
    private readonly desactivarAlertaUseCase: DesactivarAlertaUseCase,
    private readonly generarNotificacionUseCase: GenerarNotificacionUseCase,
    private readonly consultarAlertaUseCase: ConsultarAlertaUseCase,
    private readonly listarAlertasUseCase: ListarAlertasUseCase,
  ) {}

  check() {
    return {
      useCase: 'cu18-alertas-notificaciones',
      status: 'ok' as const,
    };
  }

  configurar(dto: ConfigurarAlertaDto) {
    return this.configurarAlertaUseCase.execute(dto);
  }

  activar(dto: ActivarAlertaDto) {
    return this.activarAlertaUseCase.execute(dto);
  }

  desactivar(dto: DesactivarAlertaDto) {
    return this.desactivarAlertaUseCase.execute(dto);
  }

  generarNotificacion(dto: GenerarNotificacionDto) {
    return this.generarNotificacionUseCase.execute(dto);
  }

  consultar(dto: ConsultarAlertaDto) {
    return this.consultarAlertaUseCase.execute(dto);
  }

  listar(dto: ListarAlertasDto) {
    return this.listarAlertasUseCase.execute(dto);
  }
}
