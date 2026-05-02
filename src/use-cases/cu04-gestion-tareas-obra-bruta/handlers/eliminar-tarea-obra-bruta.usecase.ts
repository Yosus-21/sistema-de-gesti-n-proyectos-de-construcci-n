import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TipoTarea } from '../../../domain';
import {
  TAREA_REPOSITORY,
  type TareaRepository,
} from '../../../infrastructure';
import { EliminarTareaObraBrutaDto } from '../dto';

@Injectable()
export class EliminarTareaObraBrutaUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async execute(
    dto: EliminarTareaObraBrutaDto,
  ): Promise<{ eliminado: true; idTarea: number }> {
    const tarea = await this.tareaRepository.findById(dto.idTarea);

    if (!tarea) {
      throw new NotFoundException(
        `No se encontro la tarea con id ${dto.idTarea}.`,
      );
    }

    if (tarea.tipoTarea !== TipoTarea.OBRA_BRUTA) {
      throw new BadRequestException(
        'La tarea indicada no corresponde a una tarea de obra bruta.',
      );
    }

    await this.tareaRepository.delete(dto.idTarea);

    return {
      eliminado: true,
      idTarea: dto.idTarea,
    };
  }
}
