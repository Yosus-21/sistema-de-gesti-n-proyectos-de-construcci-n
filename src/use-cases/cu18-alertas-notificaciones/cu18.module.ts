import { Module } from '@nestjs/common';
import { RepositoriesModule, NotificationsModule } from '../../infrastructure';
import { AlertasNotificacionesController } from './alertas-notificaciones.controller';
import { AlertasNotificacionesService } from './alertas-notificaciones.service';
import {
  ConfigurarAlertaUseCase,
  ActivarAlertaUseCase,
  DesactivarAlertaUseCase,
  GenerarNotificacionUseCase,
  ConsultarAlertaUseCase,
  ListarAlertasUseCase,
} from './handlers';

@Module({
  imports: [RepositoriesModule, NotificationsModule],
  controllers: [AlertasNotificacionesController],
  providers: [
    AlertasNotificacionesService,
    ConfigurarAlertaUseCase,
    ActivarAlertaUseCase,
    DesactivarAlertaUseCase,
    GenerarNotificacionUseCase,
    ConsultarAlertaUseCase,
    ListarAlertasUseCase,
  ],
})
export class Cu18Module {}
