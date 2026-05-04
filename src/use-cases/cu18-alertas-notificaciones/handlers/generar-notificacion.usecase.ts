import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoAlerta, MetodoNotificacion } from '../../../domain';
import {
  ALERTA_REPOSITORY,
  type AlertaRepository,
  NOTIFICATION_PORT,
  type NotificationPort,
  type SendEmailResult,
} from '../../../infrastructure';
import { GenerarNotificacionDto } from '../dto';

@Injectable()
export class GenerarNotificacionUseCase {
  constructor(
    @Inject(ALERTA_REPOSITORY)
    private readonly alertaRepository: AlertaRepository,
    @Inject(NOTIFICATION_PORT)
    private readonly notificationPort: NotificationPort,
  ) {}

  async execute(dto: GenerarNotificacionDto): Promise<{
    idAlerta: number;
    notificada: true;
    metodoNotificacion: MetodoNotificacion;
    mensajeNotificacion: string;
    fechaGeneracion: Date;
    envioEmail?: SendEmailResult;
  }> {
    const alerta = await this.alertaRepository.findById(dto.idAlerta);

    if (!alerta) {
      throw new NotFoundException(
        `No se encontro la alerta con id ${dto.idAlerta}.`,
      );
    }

    if (alerta.estadoAlerta === EstadoAlerta.INACTIVA) {
      throw new BadRequestException(
        'No se puede generar una notificación para una alerta inactiva.',
      );
    }

    const mensajeNotificacion =
      dto.mensajeNotificacion ??
      alerta.mensajeNotificacion ??
      'Notificación generada de forma provisional por el sistema.';
    const metodoNotificacion =
      dto.metodoNotificacion ??
      alerta.metodoNotificacion ??
      MetodoNotificacion.SISTEMA;
    const fechaGeneracion = new Date();

    await this.alertaRepository.update(dto.idAlerta, {
      mensajeNotificacion,
      metodoNotificacion,
      fechaGeneracion,
      estadoAlerta: EstadoAlerta.NOTIFICADA,
    });

    let envioEmail: SendEmailResult | undefined;

    if (metodoNotificacion === MetodoNotificacion.EMAIL) {
      if (dto.correoDestino) {
        envioEmail = await this.notificationPort.sendEmail({
          to: dto.correoDestino,
          subject: `SuArq Alerta: ${alerta.tipoAlerta}`,
          message: mensajeNotificacion,
        });
      } else {
        envioEmail = {
          sent: false,
          provider: 'none',
          reason:
            'No se proporcionó correoDestino para enviar la notificación.',
        };
      }
    }

    return {
      idAlerta: dto.idAlerta,
      notificada: true,
      metodoNotificacion,
      mensajeNotificacion,
      fechaGeneracion,
      envioEmail,
    };
  }
}
