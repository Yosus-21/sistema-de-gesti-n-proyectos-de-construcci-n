import { Inject, Injectable } from '@nestjs/common';
import { AsignacionTarea } from '../../../domain';
import {
  ASIGNACION_TAREA_REPOSITORY,
  type AsignacionTareaRepository,
} from '../../../infrastructure';
import { ListarAsignacionesContratistaDto } from '../dto';

@Injectable()
export class ListarAsignacionesContratistaUseCase {
  constructor(
    @Inject(ASIGNACION_TAREA_REPOSITORY)
    private readonly asignacionTareaRepository: AsignacionTareaRepository,
  ) {}

  async execute(
    dto: ListarAsignacionesContratistaDto,
  ): Promise<AsignacionTarea[]> {
    return this.asignacionTareaRepository.findMany({
      idTarea: dto.idTarea,
      idTrabajador: dto.idTrabajador,
      asignadaPorContratista: true,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
