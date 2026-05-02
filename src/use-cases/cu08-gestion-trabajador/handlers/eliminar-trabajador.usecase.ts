import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  TRABAJADOR_REPOSITORY,
  type TrabajadorRepository,
} from '../../../infrastructure';
import { EliminarTrabajadorDto } from '../dto';

export type EliminarTrabajadorResult = {
  eliminado: true;
  idTrabajador: number;
};

@Injectable()
export class EliminarTrabajadorUseCase {
  constructor(
    @Inject(TRABAJADOR_REPOSITORY)
    private readonly trabajadorRepository: TrabajadorRepository,
  ) {}

  async execute(dto: EliminarTrabajadorDto): Promise<EliminarTrabajadorResult> {
    const trabajador = await this.trabajadorRepository.findById(
      dto.idTrabajador,
    );

    if (!trabajador) {
      throw new NotFoundException(
        `No se encontro el trabajador con id ${dto.idTrabajador}.`,
      );
    }

    await this.trabajadorRepository.delete(dto.idTrabajador);

    return {
      eliminado: true,
      idTrabajador: dto.idTrabajador,
    };
  }
}
