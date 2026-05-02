import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OcupacionTrabajador, Tarea, TipoTarea } from '../../../domain';
import {
  TAREA_REPOSITORY,
  type TareaRepository,
} from '../../../infrastructure';
import { ModificarTareaObraBrutaDto } from '../dto';

@Injectable()
export class ModificarTareaObraBrutaUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async execute(dto: ModificarTareaObraBrutaDto): Promise<Tarea> {
    const tareaActual = await this.tareaRepository.findById(dto.idTarea);

    if (!tareaActual) {
      throw new NotFoundException(
        `No se encontro la tarea con id ${dto.idTarea}.`,
      );
    }

    if (tareaActual.tipoTarea !== TipoTarea.OBRA_BRUTA) {
      throw new BadRequestException(
        'La tarea indicada no corresponde a una tarea de obra bruta.',
      );
    }

    if (
      dto.perfilRequerido !== undefined &&
      !this.esPerfilObraBrutaValido(dto.perfilRequerido)
    ) {
      throw new BadRequestException(
        'El perfil requerido para tareas de obra bruta debe ser ALBANIL, PLOMERO o ELECTRICISTA.',
      );
    }

    const fechaInicioPlanificada = dto.fechaInicioPlanificada
      ? new Date(dto.fechaInicioPlanificada)
      : tareaActual.fechaInicioPlanificada;
    const fechaFinPlanificada = dto.fechaFinPlanificada
      ? new Date(dto.fechaFinPlanificada)
      : tareaActual.fechaFinPlanificada;

    if (fechaFinPlanificada < fechaInicioPlanificada) {
      throw new BadRequestException(
        'La fecha fin planificada no puede ser anterior a la fecha inicio planificada.',
      );
    }

    const cambios: Partial<Tarea> = {
      ...(dto.nombre !== undefined ? { nombre: dto.nombre } : {}),
      ...(dto.descripcion !== undefined
        ? { descripcion: dto.descripcion }
        : {}),
      ...(dto.perfilRequerido !== undefined
        ? { perfilRequerido: dto.perfilRequerido }
        : {}),
      ...(dto.duracionEstimada !== undefined
        ? { duracionEstimada: dto.duracionEstimada }
        : {}),
      ...(dto.prioridad !== undefined ? { prioridad: dto.prioridad } : {}),
    };

    return this.tareaRepository.update(dto.idTarea, {
      ...cambios,
      ...(dto.fechaInicioPlanificada !== undefined
        ? { fechaInicioPlanificada }
        : {}),
      ...(dto.fechaFinPlanificada !== undefined ? { fechaFinPlanificada } : {}),
    });
  }

  private esPerfilObraBrutaValido(
    perfilRequerido: OcupacionTrabajador,
  ): boolean {
    return [
      OcupacionTrabajador.ALBANIL,
      OcupacionTrabajador.PLOMERO,
      OcupacionTrabajador.ELECTRICISTA,
    ].includes(perfilRequerido);
  }
}
