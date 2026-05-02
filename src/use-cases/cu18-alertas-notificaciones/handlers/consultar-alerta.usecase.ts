import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Alerta } from '../../../domain';
import {
  ALERTA_REPOSITORY,
  type AlertaRepository,
} from '../../../infrastructure';
import { ConsultarAlertaDto } from '../dto';

@Injectable()
export class ConsultarAlertaUseCase {
  constructor(
    @Inject(ALERTA_REPOSITORY)
    private readonly alertaRepository: AlertaRepository,
  ) {}

  async execute(dto: ConsultarAlertaDto): Promise<Alerta> {
    const alerta = await this.alertaRepository.findById(dto.idAlerta);

    if (!alerta) {
      throw new NotFoundException(
        `No se encontro la alerta con id ${dto.idAlerta}.`,
      );
    }

    return alerta;
  }
}
