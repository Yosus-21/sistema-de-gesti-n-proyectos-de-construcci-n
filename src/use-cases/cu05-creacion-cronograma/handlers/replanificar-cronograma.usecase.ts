import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cronograma, EstadoCronograma } from '../../../domain';
import {
  CRONOGRAMA_REPOSITORY,
  type CronogramaRepository,
} from '../../../infrastructure';
import { ReplanificarCronogramaDto } from '../dto';

@Injectable()
export class ReplanificarCronogramaUseCase {
  constructor(
    @Inject(CRONOGRAMA_REPOSITORY)
    private readonly cronogramaRepository: CronogramaRepository,
  ) {}

  async execute(dto: ReplanificarCronogramaDto): Promise<Cronograma> {
    const cronograma = await this.cronogramaRepository.findById(
      dto.idCronograma,
    );

    if (!cronograma) {
      throw new NotFoundException(
        `No se encontro el cronograma con id ${dto.idCronograma}.`,
      );
    }

    return this.cronogramaRepository.update(dto.idCronograma, {
      motivoReplanificacion: dto.motivoReplanificacion,
      fechaUltimaModificacion: new Date(),
      estadoCronograma: EstadoCronograma.REPLANIFICADO,
      ...(dto.nuevasAccionesAnteRetraso !== undefined
        ? { accionesAnteRetraso: dto.nuevasAccionesAnteRetraso }
        : {}),
    });
  }
}
