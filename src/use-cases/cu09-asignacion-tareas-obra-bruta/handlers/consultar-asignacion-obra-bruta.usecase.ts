import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AsignacionTarea } from '../../../domain';
import {
  ASIGNACION_TAREA_REPOSITORY,
  type AsignacionTareaRepository,
} from '../../../infrastructure';
import { ConsultarAsignacionObraBrutaDto } from '../dto';

@Injectable()
export class ConsultarAsignacionObraBrutaUseCase {
  constructor(
    @Inject(ASIGNACION_TAREA_REPOSITORY)
    private readonly asignacionTareaRepository: AsignacionTareaRepository,
  ) {}

  async execute(
    dto: ConsultarAsignacionObraBrutaDto,
  ): Promise<AsignacionTarea> {
    const asignacion = await this.asignacionTareaRepository.findById(
      dto.idAsignacionTarea,
    );

    if (!asignacion) {
      throw new NotFoundException(
        `No se encontro la asignacion con id ${dto.idAsignacionTarea}.`,
      );
    }

    return asignacion;
  }
}
