import { Inject, Injectable } from '@nestjs/common';
import { Cronograma } from '../../../domain';
import {
  CRONOGRAMA_REPOSITORY,
  type CronogramaRepository,
} from '../../../infrastructure';
import { ListarCronogramasDto } from '../dto';

@Injectable()
export class ListarCronogramasUseCase {
  constructor(
    @Inject(CRONOGRAMA_REPOSITORY)
    private readonly cronogramaRepository: CronogramaRepository,
  ) {}

  async execute(dto: ListarCronogramasDto): Promise<Cronograma[]> {
    return this.cronogramaRepository.findMany({
      idProyecto: dto.idProyecto,
      busqueda: dto.busqueda,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
