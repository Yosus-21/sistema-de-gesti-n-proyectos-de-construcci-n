import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  TAREA_REPOSITORY,
  type TareaRepository,
} from '../../../infrastructure';
import { CalcularDesviacionDto } from '../dto';

export type CalcularDesviacionResult = {
  idTarea: number;
  diasDesviacion: number;
  atrasada: boolean;
};

@Injectable()
export class CalcularDesviacionUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async execute(dto: CalcularDesviacionDto): Promise<CalcularDesviacionResult> {
    const tarea = await this.tareaRepository.findById(dto.idTarea);

    if (!tarea) {
      throw new NotFoundException(
        `No se encontro la tarea con id ${dto.idTarea}.`,
      );
    }

    const fechaReferencia = tarea.fechaFinReal ?? new Date();
    const diffMs =
      fechaReferencia.getTime() - tarea.fechaFinPlanificada.getTime();
    const dayMs = 1000 * 60 * 60 * 24;

    if (diffMs <= 0) {
      return {
        idTarea: dto.idTarea,
        diasDesviacion: 0,
        atrasada: false,
      };
    }

    return {
      idTarea: dto.idTarea,
      diasDesviacion: Math.ceil(diffMs / dayMs),
      atrasada: true,
    };
  }
}
