import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AsignacionTarea, EstadoAsignacion } from '../../../domain';
import {
  ASIGNACION_TAREA_REPOSITORY,
  type AsignacionTareaRepository,
} from '../../../infrastructure';
import { CancelarAsignacionContratistaDto } from '../dto';

@Injectable()
export class CancelarAsignacionContratistaUseCase {
  constructor(
    @Inject(ASIGNACION_TAREA_REPOSITORY)
    private readonly asignacionTareaRepository: AsignacionTareaRepository,
  ) {}

  async execute(
    dto: CancelarAsignacionContratistaDto,
  ): Promise<AsignacionTarea> {
    const asignacion = await this.asignacionTareaRepository.findById(
      dto.idAsignacionTarea,
    );

    if (!asignacion) {
      throw new NotFoundException(
        `No se encontro la asignacion con id ${dto.idAsignacionTarea}.`,
      );
    }

    if (!asignacion.asignadaPorContratista) {
      throw new BadRequestException(
        'La asignacion indicada no fue registrada por un contratista.',
      );
    }

    return this.asignacionTareaRepository.update(dto.idAsignacionTarea, {
      estadoAsignacion: EstadoAsignacion.CANCELADA,
    });
  }
}
