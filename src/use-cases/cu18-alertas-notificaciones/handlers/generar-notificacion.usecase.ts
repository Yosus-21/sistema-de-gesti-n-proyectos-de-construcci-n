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
} from '../../../infrastructure';
import { GenerarNotificacionDto } from '../dto';

@Injectable()
export class GenerarNotificacionUseCase {
  constructor(
    @Inject(ALERTA_REPOSITORY)
    private readonly alertaRepository: AlertaRepository,
  ) {}

  async execute(dto: GenerarNotificacionDto): Promise<{
    idAlerta: number;
    notificada: true;
    metodoNotificacion: MetodoNotificacion;
    mensajeNotificacion: string;
    fechaGeneracion: Date;
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

    return {
      idAlerta: dto.idAlerta,
      notificada: true,
      metodoNotificacion,
      mensajeNotificacion,
      fechaGeneracion,
    };
  }
}
