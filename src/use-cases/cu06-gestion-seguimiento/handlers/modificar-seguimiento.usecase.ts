import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Seguimiento } from '../../../domain';
import {
  SEGUIMIENTO_REPOSITORY,
  type SeguimientoRepository,
} from '../../../infrastructure';
import { ModificarSeguimientoDto } from '../dto';

@Injectable()
export class ModificarSeguimientoUseCase {
  constructor(
    @Inject(SEGUIMIENTO_REPOSITORY)
    private readonly seguimientoRepository: SeguimientoRepository,
  ) {}

  async execute(dto: ModificarSeguimientoDto): Promise<Seguimiento> {
    const seguimientoActual = await this.seguimientoRepository.findById(
      dto.idSeguimiento,
    );

    if (!seguimientoActual) {
      throw new NotFoundException(
        `No se encontro el seguimiento con id ${dto.idSeguimiento}.`,
      );
    }

    if (dto.porcentajeAvance !== undefined) {
      this.validarPorcentajeAvance(dto.porcentajeAvance);
    }

    const { idSeguimiento, fechaSeguimiento, ...cambios } = dto;

    const datosActualizacion: Partial<Seguimiento> = {
      ...cambios,
      ...(fechaSeguimiento !== undefined
        ? { fechaSeguimiento: new Date(fechaSeguimiento) }
        : {}),
    };

    return this.seguimientoRepository.update(idSeguimiento, datosActualizacion);
  }

  private validarPorcentajeAvance(porcentajeAvance: number): void {
    if (porcentajeAvance < 0 || porcentajeAvance > 100) {
      throw new BadRequestException(
        'El porcentaje de avance debe estar entre 0 y 100.',
      );
    }
  }
}
