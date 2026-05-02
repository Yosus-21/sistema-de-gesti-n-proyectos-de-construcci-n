import { Inject, Injectable } from '@nestjs/common';
import { AsignacionTarea } from '../../../domain';
import {
  ASIGNACION_TAREA_REPOSITORY,
  type AsignacionTareaRepository,
} from '../../../infrastructure';
import { ListarAsignacionesObraFinaDto } from '../dto';

@Injectable()
export class ListarAsignacionesObraFinaUseCase {
  constructor(
    @Inject(ASIGNACION_TAREA_REPOSITORY)
    private readonly asignacionTareaRepository: AsignacionTareaRepository,
  ) {}

  async execute(
    dto: ListarAsignacionesObraFinaDto,
  ): Promise<AsignacionTarea[]> {
    return this.asignacionTareaRepository.findMany({
      idTarea: dto.idTarea,
      idTrabajador: dto.idTrabajador,
      asignadaPorContratista: false,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
