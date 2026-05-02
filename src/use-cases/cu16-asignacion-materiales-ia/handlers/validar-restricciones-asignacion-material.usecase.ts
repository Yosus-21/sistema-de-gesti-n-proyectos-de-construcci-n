import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PROYECTO_REPOSITORY,
  TAREA_REPOSITORY,
  type ProyectoRepository,
  type TareaRepository,
} from '../../../infrastructure';
import { ValidarRestriccionesAsignacionMaterialDto } from '../dto';

@Injectable()
export class ValidarRestriccionesAsignacionMaterialUseCase {
  constructor(
    @Inject(PROYECTO_REPOSITORY)
    private readonly proyectoRepository: ProyectoRepository,
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async execute(dto: ValidarRestriccionesAsignacionMaterialDto): Promise<{
    valido: true;
    idProyecto?: number;
    idTarea?: number;
    restricciones?: string;
    mensaje: string;
  }> {
    if (dto.idProyecto !== undefined) {
      const proyecto = await this.proyectoRepository.findById(dto.idProyecto);

      if (!proyecto) {
        throw new NotFoundException(
          `No se encontro el proyecto con id ${dto.idProyecto}.`,
        );
      }
    }

    if (dto.idTarea !== undefined) {
      const tarea = await this.tareaRepository.findById(dto.idTarea);

      if (!tarea) {
        throw new NotFoundException(
          `No se encontro la tarea con id ${dto.idTarea}.`,
        );
      }
    }

    return {
      valido: true,
      idProyecto: dto.idProyecto,
      idTarea: dto.idTarea,
      restricciones: dto.restricciones,
      mensaje: 'Restricciones validadas de forma provisional.',
    };
  }
}
