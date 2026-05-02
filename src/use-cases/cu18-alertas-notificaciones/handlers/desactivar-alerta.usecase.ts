import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Alerta, EstadoAlerta } from '../../../domain';
import {
  ALERTA_REPOSITORY,
  type AlertaRepository,
} from '../../../infrastructure';
import { DesactivarAlertaDto } from '../dto';

@Injectable()
export class DesactivarAlertaUseCase {
  constructor(
    @Inject(ALERTA_REPOSITORY)
    private readonly alertaRepository: AlertaRepository,
  ) {}

  async execute(dto: DesactivarAlertaDto): Promise<Alerta> {
    const alerta = await this.alertaRepository.findById(dto.idAlerta);

    if (!alerta) {
      throw new NotFoundException(
        `No se encontro la alerta con id ${dto.idAlerta}.`,
      );
    }

    return this.alertaRepository.update(dto.idAlerta, {
      estadoAlerta: EstadoAlerta.INACTIVA,
    });
  }
}
