import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Seguimiento } from '../../../domain';
import {
  SEGUIMIENTO_REPOSITORY,
  type SeguimientoRepository,
} from '../../../infrastructure';
import { ConsultarSeguimientoDto } from '../dto';

@Injectable()
export class ConsultarSeguimientoUseCase {
  constructor(
    @Inject(SEGUIMIENTO_REPOSITORY)
    private readonly seguimientoRepository: SeguimientoRepository,
  ) {}

  async execute(dto: ConsultarSeguimientoDto): Promise<Seguimiento> {
    const seguimiento = await this.seguimientoRepository.findById(
      dto.idSeguimiento,
    );

    if (!seguimiento) {
      throw new NotFoundException(
        `No se encontro el seguimiento con id ${dto.idSeguimiento}.`,
      );
    }

    return seguimiento;
  }
}
