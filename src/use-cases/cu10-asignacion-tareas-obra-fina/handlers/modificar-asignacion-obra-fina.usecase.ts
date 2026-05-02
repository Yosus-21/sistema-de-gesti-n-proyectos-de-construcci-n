import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AsignacionTarea,
  OcupacionTrabajador,
  TipoTarea,
} from '../../../domain';
import {
  ASIGNACION_TAREA_REPOSITORY,
  TAREA_REPOSITORY,
  TRABAJADOR_REPOSITORY,
  type AsignacionTareaRepository,
  type TareaRepository,
  type TrabajadorRepository,
} from '../../../infrastructure';
import { ModificarAsignacionObraFinaDto } from '../dto';

@Injectable()
export class ModificarAsignacionObraFinaUseCase {
  constructor(
    @Inject(ASIGNACION_TAREA_REPOSITORY)
    private readonly asignacionTareaRepository: AsignacionTareaRepository,
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
    @Inject(TRABAJADOR_REPOSITORY)
    private readonly trabajadorRepository: TrabajadorRepository,
  ) {}

  async execute(dto: ModificarAsignacionObraFinaDto): Promise<AsignacionTarea> {
    const asignacionActual = await this.asignacionTareaRepository.findById(
      dto.idAsignacionTarea,
    );

    if (!asignacionActual) {
      throw new NotFoundException(
        `No se encontro la asignacion con id ${dto.idAsignacionTarea}.`,
      );
    }

    if (dto.idTarea !== undefined) {
      const tarea = await this.tareaRepository.findById(dto.idTarea);

      if (!tarea) {
        throw new NotFoundException(
          `No se encontro la tarea con id ${dto.idTarea}.`,
        );
      }

      if (tarea.tipoTarea !== TipoTarea.OBRA_FINA) {
        throw new BadRequestException(
          'La tarea indicada no corresponde a una tarea de obra fina.',
        );
      }
    }

    if (dto.idTrabajador !== undefined) {
      const trabajador = await this.trabajadorRepository.findById(
        dto.idTrabajador,
      );

      if (!trabajador) {
        throw new NotFoundException(
          `No se encontro el trabajador con id ${dto.idTrabajador}.`,
        );
      }

      this.validarOcupacionCompatible(trabajador.ocupacion);
    }

    const idTareaFinal = dto.idTarea ?? asignacionActual.idTarea;
    const idTrabajadorFinal = dto.idTrabajador ?? asignacionActual.idTrabajador;
    const cambioParPrincipal =
      idTareaFinal !== asignacionActual.idTarea ||
      idTrabajadorFinal !== asignacionActual.idTrabajador;

    if (
      cambioParPrincipal &&
      idTareaFinal !== undefined &&
      idTrabajadorFinal !== undefined
    ) {
      const yaExiste =
        await this.asignacionTareaRepository.existsActiveAssignment(
          idTareaFinal,
          idTrabajadorFinal,
        );

      if (yaExiste) {
        throw new ConflictException(
          'Ya existe una asignacion activa para este trabajador en la tarea indicada.',
        );
      }
    }

    const datosActualizacion: Partial<AsignacionTarea> = {
      ...(dto.idTarea !== undefined ? { idTarea: dto.idTarea } : {}),
      ...(dto.idTrabajador !== undefined
        ? { idTrabajador: dto.idTrabajador }
        : {}),
      ...(dto.fechaAsignacion !== undefined
        ? { fechaAsignacion: new Date(dto.fechaAsignacion) }
        : {}),
      ...(dto.rolEnLaTarea !== undefined
        ? { rolEnLaTarea: dto.rolEnLaTarea }
        : {}),
      ...(dto.observaciones !== undefined
        ? { observaciones: dto.observaciones }
        : {}),
    };

    return this.asignacionTareaRepository.update(
      dto.idAsignacionTarea,
      datosActualizacion,
    );
  }

  private validarOcupacionCompatible(ocupacion: OcupacionTrabajador): void {
    const ocupacionesPermitidas = [
      OcupacionTrabajador.VIDRIERO,
      OcupacionTrabajador.CARPINTERO,
    ];

    if (!ocupacionesPermitidas.includes(ocupacion)) {
      throw new BadRequestException(
        'El trabajador no tiene una ocupacion compatible con obra fina.',
      );
    }
  }
}
