import { Inject, Injectable } from '@nestjs/common';
import { Tarea, TipoTarea } from '../../../domain';
import {
  TAREA_REPOSITORY,
  type TareaRepository,
} from '../../../infrastructure';
import { ListarTareasObraBrutaDto } from '../dto';

@Injectable()
export class ListarTareasObraBrutaUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async execute(dto: ListarTareasObraBrutaDto): Promise<Tarea[]> {
    return this.tareaRepository.findMany({
      idProyecto: dto.idProyecto,
      tipoTarea: TipoTarea.OBRA_BRUTA,
      busqueda: dto.busqueda,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
