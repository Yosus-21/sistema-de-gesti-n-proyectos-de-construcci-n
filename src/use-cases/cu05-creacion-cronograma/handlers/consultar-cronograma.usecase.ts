import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cronograma } from '../../../domain';
import {
  CRONOGRAMA_REPOSITORY,
  type CronogramaRepository,
} from '../../../infrastructure';
import { ConsultarCronogramaDto } from '../dto';

@Injectable()
export class ConsultarCronogramaUseCase {
  constructor(
    @Inject(CRONOGRAMA_REPOSITORY)
    private readonly cronogramaRepository: CronogramaRepository,
  ) {}

  async execute(dto: ConsultarCronogramaDto): Promise<Cronograma> {
    const cronograma = await this.cronogramaRepository.findById(
      dto.idCronograma,
    );

    if (!cronograma) {
      throw new NotFoundException(
        `No se encontro el cronograma con id ${dto.idCronograma}.`,
      );
    }

    return cronograma;
  }
}
