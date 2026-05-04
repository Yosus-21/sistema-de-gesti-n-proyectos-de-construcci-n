import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { AsignacionTarea, EstadoAsignacion, Tarea } from '../../domain';
import { rangesOverlap } from '../../common';
import {
  ASIGNACION_TAREA_REPOSITORY,
  TAREA_REPOSITORY,
  type AsignacionTareaRepository,
  type TareaRepository,
} from '../../infrastructure';

export interface ConflictoDisponibilidadTrabajador {
  idAsignacionTarea: number;
  idTarea: number;
  nombreTarea: string;
  fechaInicio: string;
  fechaFin: string;
  estadoAsignacion: EstadoAsignacion;
}

export interface VerificarDisponibilidadTrabajadorParams {
  idTrabajador: number;
  fechaInicio: Date;
  fechaFin: Date;
  idAsignacionTareaExcluir?: number;
}

export interface DisponibilidadTrabajadorResult {
  disponible: boolean;
  conflictos: ConflictoDisponibilidadTrabajador[];
}

const ESTADOS_ASIGNACION_ACTIVOS = [
  EstadoAsignacion.PENDIENTE,
  EstadoAsignacion.CONFIRMADA,
  EstadoAsignacion.REASIGNADA,
];

@Injectable()
export class TrabajadorDisponibilidadService {
  constructor(
    @Inject(ASIGNACION_TAREA_REPOSITORY)
    private readonly asignacionTareaRepository: AsignacionTareaRepository,
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
  ) {}

  async verificar(
    params: VerificarDisponibilidadTrabajadorParams,
  ): Promise<DisponibilidadTrabajadorResult> {
    const asignaciones = await this.asignacionTareaRepository.findMany({
      idTrabajador: params.idTrabajador,
    });

    const conflictos: ConflictoDisponibilidadTrabajador[] = [];

    for (const asignacion of asignaciones) {
      if (
        !this.esAsignacionOcupante(asignacion, params.idAsignacionTareaExcluir)
      ) {
        continue;
      }

      if (asignacion.idTarea === undefined) {
        continue;
      }

      const tarea = await this.tareaRepository.findById(asignacion.idTarea);

      if (!tarea) {
        continue;
      }

      if (
        rangesOverlap(
          params.fechaInicio,
          params.fechaFin,
          tarea.fechaInicioPlanificada,
          tarea.fechaFinPlanificada,
        )
      ) {
        conflictos.push(this.toConflicto(asignacion, tarea));
      }
    }

    return {
      disponible: conflictos.length === 0,
      conflictos,
    };
  }

  async validarDisponibleParaTarea(
    idTrabajador: number,
    tarea: Tarea,
    idAsignacionTareaExcluir?: number,
  ): Promise<void> {
    const disponibilidad = await this.verificar({
      idTrabajador,
      fechaInicio: tarea.fechaInicioPlanificada,
      fechaFin: tarea.fechaFinPlanificada,
      idAsignacionTareaExcluir,
    });

    if (!disponibilidad.disponible) {
      throw new ConflictException(
        'El trabajador no está disponible en el rango de fechas de la tarea.',
      );
    }
  }

  private esAsignacionOcupante(
    asignacion: AsignacionTarea,
    idAsignacionTareaExcluir?: number,
  ): boolean {
    if (
      idAsignacionTareaExcluir !== undefined &&
      asignacion.idAsignacionTarea === idAsignacionTareaExcluir
    ) {
      return false;
    }

    return ESTADOS_ASIGNACION_ACTIVOS.includes(asignacion.estadoAsignacion);
  }

  private toConflicto(
    asignacion: AsignacionTarea,
    tarea: Tarea,
  ): ConflictoDisponibilidadTrabajador {
    return {
      idAsignacionTarea: asignacion.idAsignacionTarea as number,
      idTarea: tarea.idTarea as number,
      nombreTarea: tarea.nombre,
      fechaInicio: tarea.fechaInicioPlanificada.toISOString(),
      fechaFin: tarea.fechaFinPlanificada.toISOString(),
      estadoAsignacion: asignacion.estadoAsignacion,
    };
  }
}
