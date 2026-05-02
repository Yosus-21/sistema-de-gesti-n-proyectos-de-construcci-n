import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Trabajador } from '../../../domain';
import {
  TRABAJADOR_REPOSITORY,
  type TrabajadorRepository,
} from '../../../infrastructure';
import { ConsultarTrabajadorDto } from '../dto';

@Injectable()
export class ConsultarTrabajadorUseCase {
  constructor(
    @Inject(TRABAJADOR_REPOSITORY)
    private readonly trabajadorRepository: TrabajadorRepository,
  ) {}

  async execute(dto: ConsultarTrabajadorDto): Promise<Trabajador> {
    const trabajador = await this.trabajadorRepository.findById(
      dto.idTrabajador,
    );

    if (!trabajador) {
      throw new NotFoundException(
        `No se encontro el trabajador con id ${dto.idTrabajador}.`,
      );
    }

    return trabajador;
  }
}
