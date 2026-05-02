import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  TRABAJADOR_REPOSITORY,
  type TrabajadorRepository,
} from '../../../infrastructure';
import { VerificarDisponibilidadTrabajadorDto } from '../dto';

export type VerificarDisponibilidadTrabajadorResult = {
  idTrabajador: number;
  disponible: true;
  motivo: string;
};

@Injectable()
export class VerificarDisponibilidadTrabajadorUseCase {
  constructor(
    @Inject(TRABAJADOR_REPOSITORY)
    private readonly trabajadorRepository: TrabajadorRepository,
  ) {}

  async execute(
    dto: VerificarDisponibilidadTrabajadorDto,
  ): Promise<VerificarDisponibilidadTrabajadorResult> {
    const trabajador = await this.trabajadorRepository.findById(
      dto.idTrabajador,
    );

    if (!trabajador) {
      throw new NotFoundException(
        `No se encontro el trabajador con id ${dto.idTrabajador}.`,
      );
    }

    const fechaInicio = new Date(dto.fechaInicio);
    const fechaFin = new Date(dto.fechaFin);

    if (fechaFin.getTime() < fechaInicio.getTime()) {
      throw new BadRequestException(
        'La fecha de fin no puede ser anterior a la fecha de inicio.',
      );
    }

    return {
      idTrabajador: dto.idTrabajador,
      disponible: true,
      motivo:
        'Disponibilidad provisional: las asignaciones se validarán cuando se implemente CU09-CU11.',
    };
  }
}
