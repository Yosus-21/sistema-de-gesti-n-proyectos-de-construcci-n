import { Inject, Injectable } from '@nestjs/common';
import { Tarea, TipoTarea } from '../../../domain';
import {
  TAREA_REPOSITORY,
  type TareaRepository,
} from '../../../infrastructure';
import { ListarTareasObraFinaDto } from '../dto';

@Injectable()
export class ListarTareasObraFinaUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async execute(dto: ListarTareasObraFinaDto): Promise<Tarea[]> {
    return this.tareaRepository.findMany({
      idProyecto: dto.idProyecto,
      tipoTarea: TipoTarea.OBRA_FINA,
      busqueda: dto.busqueda,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
