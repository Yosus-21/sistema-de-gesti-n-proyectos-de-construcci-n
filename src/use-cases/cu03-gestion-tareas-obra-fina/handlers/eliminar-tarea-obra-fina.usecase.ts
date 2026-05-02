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
import { EliminarTareaObraFinaDto } from '../dto';

@Injectable()
export class EliminarTareaObraFinaUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async execute(
    dto: EliminarTareaObraFinaDto,
  ): Promise<{ eliminado: true; idTarea: number }> {
    const tarea = await this.tareaRepository.findById(dto.idTarea);

    if (!tarea) {
      throw new NotFoundException(
        `No se encontro la tarea con id ${dto.idTarea}.`,
      );
    }

    if (tarea.tipoTarea !== TipoTarea.OBRA_FINA) {
      throw new BadRequestException(
        'La tarea indicada no corresponde a una tarea de obra fina.',
      );
    }

    await this.tareaRepository.delete(dto.idTarea);

    return {
      eliminado: true,
      idTarea: dto.idTarea,
    };
  }
}
