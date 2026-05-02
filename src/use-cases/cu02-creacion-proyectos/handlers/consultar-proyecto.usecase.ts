import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Proyecto } from '../../../domain';
import {
  PROYECTO_REPOSITORY,
  type ProyectoRepository,
} from '../../../infrastructure';
import { ConsultarProyectoDto } from '../dto';

@Injectable()
export class ConsultarProyectoUseCase {
  constructor(
    @Inject(PROYECTO_REPOSITORY)
    private readonly proyectoRepository: ProyectoRepository,
  ) {}

  async execute(dto: ConsultarProyectoDto): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findById(dto.idProyecto);

    if (!proyecto) {
      throw new NotFoundException(
        `No se encontro el proyecto con id ${dto.idProyecto}.`,
      );
    }

    return proyecto;
  }
}
