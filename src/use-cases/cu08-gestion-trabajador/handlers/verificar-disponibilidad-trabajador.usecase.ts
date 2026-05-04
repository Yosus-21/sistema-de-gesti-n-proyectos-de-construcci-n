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
import {
  TrabajadorDisponibilidadService,
  type ConflictoDisponibilidadTrabajador,
} from '../../shared';
import { VerificarDisponibilidadTrabajadorDto } from '../dto';

export type VerificarDisponibilidadTrabajadorResult = {
  idTrabajador: number;
  disponible: boolean;
  fechaInicio: string;
  fechaFin: string;
  conflictos: ConflictoDisponibilidadTrabajador[];
};

@Injectable()
export class VerificarDisponibilidadTrabajadorUseCase {
  constructor(
    @Inject(TRABAJADOR_REPOSITORY)
    private readonly trabajadorRepository: TrabajadorRepository,
    private readonly trabajadorDisponibilidadService: TrabajadorDisponibilidadService,
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

    const disponibilidad = await this.trabajadorDisponibilidadService.verificar(
      {
        idTrabajador: dto.idTrabajador,
        fechaInicio,
        fechaFin,
      },
    );

    return {
      idTrabajador: dto.idTrabajador,
      disponible: disponibilidad.disponible,
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
      conflictos: disponibilidad.conflictos,
    };
  }
}
