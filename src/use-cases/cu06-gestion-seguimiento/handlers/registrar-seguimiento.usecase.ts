import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoTarea, Seguimiento, Tarea } from '../../../domain';
import {
  SEGUIMIENTO_REPOSITORY,
  TAREA_REPOSITORY,
  type SeguimientoRepository,
  type TareaRepository,
} from '../../../infrastructure';
import { RegistrarSeguimientoDto } from '../dto';

@Injectable()
export class RegistrarSeguimientoUseCase {
  constructor(
    @Inject(SEGUIMIENTO_REPOSITORY)
    private readonly seguimientoRepository: SeguimientoRepository,
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async execute(dto: RegistrarSeguimientoDto): Promise<Seguimiento> {
    const tarea = await this.tareaRepository.findById(dto.idTarea);

    if (!tarea) {
      throw new NotFoundException(
        `No se encontro la tarea con id ${dto.idTarea}.`,
      );
    }

    this.validarPorcentajeAvance(dto.porcentajeAvance);

    const fechaSeguimiento = new Date(dto.fechaSeguimiento);

    const seguimiento = new Seguimiento({
      idTarea: dto.idTarea,
      fechaSeguimiento,
      estadoReportado: dto.estadoReportado,
      cantidadMaterialUsado: dto.cantidadMaterialUsado,
      porcentajeAvance: dto.porcentajeAvance,
      observaciones: dto.observaciones,
    });

    const seguimientoCreado =
      await this.seguimientoRepository.create(seguimiento);

    if (dto.porcentajeAvance > 0) {
      const cambiosTarea: Partial<Tarea> = {};

      if (!tarea.fechaInicioReal) {
        cambiosTarea.fechaInicioReal = fechaSeguimiento;
      }

      if (dto.porcentajeAvance >= 100) {
        cambiosTarea.fechaFinReal = fechaSeguimiento;
        cambiosTarea.estadoTarea = EstadoTarea.COMPLETADA;
      } else {
        cambiosTarea.estadoTarea = EstadoTarea.EN_PROCESO;
      }

      await this.tareaRepository.update(dto.idTarea, cambiosTarea);
    }

    return seguimientoCreado;
  }

  private validarPorcentajeAvance(porcentajeAvance: number): void {
    if (porcentajeAvance < 0 || porcentajeAvance > 100) {
      throw new BadRequestException(
        'El porcentaje de avance debe estar entre 0 y 100.',
      );
    }
  }
}
