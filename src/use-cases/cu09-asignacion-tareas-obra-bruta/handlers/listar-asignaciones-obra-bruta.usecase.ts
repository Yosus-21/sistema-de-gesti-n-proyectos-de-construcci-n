import { Inject, Injectable } from '@nestjs/common';
import { AsignacionTarea } from '../../../domain';
import {
  ASIGNACION_TAREA_REPOSITORY,
  type AsignacionTareaRepository,
} from '../../../infrastructure';
import { ListarAsignacionesObraBrutaDto } from '../dto';

@Injectable()
export class ListarAsignacionesObraBrutaUseCase {
  constructor(
    @Inject(ASIGNACION_TAREA_REPOSITORY)
    private readonly asignacionTareaRepository: AsignacionTareaRepository,
  ) {}

  async execute(
    dto: ListarAsignacionesObraBrutaDto,
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
