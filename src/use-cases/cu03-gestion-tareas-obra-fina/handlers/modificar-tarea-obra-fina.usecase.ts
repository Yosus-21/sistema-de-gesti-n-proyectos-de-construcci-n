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
import { ModificarTareaObraFinaDto } from '../dto';

@Injectable()
export class ModificarTareaObraFinaUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async execute(dto: ModificarTareaObraFinaDto): Promise<Tarea> {
    const tareaActual = await this.tareaRepository.findById(dto.idTarea);

    if (!tareaActual) {
      throw new NotFoundException(
        `No se encontro la tarea con id ${dto.idTarea}.`,
      );
    }

    if (tareaActual.tipoTarea !== TipoTarea.OBRA_FINA) {
      throw new BadRequestException(
        'La tarea indicada no corresponde a una tarea de obra fina.',
      );
    }

    if (
      dto.perfilRequerido !== undefined &&
      !this.esPerfilObraFinaValido(dto.perfilRequerido)
    ) {
      throw new BadRequestException(
        'El perfil requerido para tareas de obra fina debe ser VIDRIERO o CARPINTERO.',
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

  private esPerfilObraFinaValido(
    perfilRequerido: OcupacionTrabajador,
  ): boolean {
    return [
      OcupacionTrabajador.VIDRIERO,
      OcupacionTrabajador.CARPINTERO,
    ].includes(perfilRequerido);
  }
}
