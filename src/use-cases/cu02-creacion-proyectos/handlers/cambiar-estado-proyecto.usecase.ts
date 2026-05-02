import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Proyecto } from '../../../domain';
import {
  PROYECTO_REPOSITORY,
  type ProyectoRepository,
} from '../../../infrastructure';
import { CambiarEstadoProyectoDto } from '../dto';

@Injectable()
export class CambiarEstadoProyectoUseCase {
  constructor(
    @Inject(PROYECTO_REPOSITORY)
    private readonly proyectoRepository: ProyectoRepository,
  ) {}

  async execute(dto: CambiarEstadoProyectoDto): Promise<Proyecto> {
    const proyecto = await this.proyectoRepository.findById(dto.idProyecto);

    if (!proyecto) {
      throw new NotFoundException(
        `No se encontro el proyecto con id ${dto.idProyecto}.`,
      );
    }

    return this.proyectoRepository.update(dto.idProyecto, {
      estadoProyecto: dto.estadoProyecto,
    });
  }
}
