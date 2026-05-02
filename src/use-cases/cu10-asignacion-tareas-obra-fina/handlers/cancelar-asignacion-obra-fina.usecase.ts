import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AsignacionTarea, EstadoAsignacion } from '../../../domain';
import {
  ASIGNACION_TAREA_REPOSITORY,
  type AsignacionTareaRepository,
} from '../../../infrastructure';
import { CancelarAsignacionObraFinaDto } from '../dto';

@Injectable()
export class CancelarAsignacionObraFinaUseCase {
  constructor(
    @Inject(ASIGNACION_TAREA_REPOSITORY)
    private readonly asignacionTareaRepository: AsignacionTareaRepository,
  ) {}

  async execute(dto: CancelarAsignacionObraFinaDto): Promise<AsignacionTarea> {
    const asignacion = await this.asignacionTareaRepository.findById(
      dto.idAsignacionTarea,
    );

    if (!asignacion) {
      throw new NotFoundException(
        `No se encontro la asignacion con id ${dto.idAsignacionTarea}.`,
      );
    }

    return this.asignacionTareaRepository.update(dto.idAsignacionTarea, {
      estadoAsignacion: EstadoAsignacion.CANCELADA,
    });
  }
}
