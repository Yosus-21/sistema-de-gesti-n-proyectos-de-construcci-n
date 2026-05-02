import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AsignacionTarea,
  EstadoAsignacion,
  OcupacionTrabajador,
} from '../../../domain';
import {
  ASIGNACION_TAREA_REPOSITORY,
  TRABAJADOR_REPOSITORY,
  type AsignacionTareaRepository,
  type TrabajadorRepository,
} from '../../../infrastructure';
import { ReasignarTrabajadorContratistaDto } from '../dto';

@Injectable()
export class ReasignarTrabajadorContratistaUseCase {
  constructor(
    @Inject(ASIGNACION_TAREA_REPOSITORY)
    private readonly asignacionTareaRepository: AsignacionTareaRepository,
    @Inject(TRABAJADOR_REPOSITORY)
    private readonly trabajadorRepository: TrabajadorRepository,
  ) {}

  async execute(
    dto: ReasignarTrabajadorContratistaDto,
  ): Promise<AsignacionTarea> {
    const asignacion = await this.asignacionTareaRepository.findById(
      dto.idAsignacionTarea,
    );

    if (!asignacion) {
      throw new NotFoundException(
        `No se encontro la asignacion con id ${dto.idAsignacionTarea}.`,
      );
    }

    if (!asignacion.asignadaPorContratista) {
      throw new BadRequestException(
        'La asignacion indicada no fue registrada por un contratista.',
      );
    }

    const nuevoTrabajador = await this.trabajadorRepository.findById(
      dto.idNuevoTrabajador,
    );

    if (!nuevoTrabajador) {
      throw new NotFoundException(
        `No se encontro el trabajador con id ${dto.idNuevoTrabajador}.`,
      );
    }

    this.validarOcupacionCompatible(nuevoTrabajador.ocupacion);

    if (asignacion.idTarea === undefined) {
      throw new BadRequestException(
        'La asignacion indicada no tiene una tarea asociada.',
      );
    }

    if (dto.idNuevoTrabajador !== asignacion.idTrabajador) {
      const yaExiste =
        await this.asignacionTareaRepository.existsActiveAssignment(
          asignacion.idTarea,
          dto.idNuevoTrabajador,
        );

      if (yaExiste) {
        throw new ConflictException(
          'Ya existe una asignacion activa para este trabajador en la tarea indicada.',
        );
      }
    }

    return this.asignacionTareaRepository.update(dto.idAsignacionTarea, {
      idTrabajador: dto.idNuevoTrabajador,
      estadoAsignacion: EstadoAsignacion.REASIGNADA,
      ...(dto.motivoReasignacion !== undefined
        ? { observaciones: dto.motivoReasignacion }
        : {}),
    });
  }

  private validarOcupacionCompatible(ocupacion: OcupacionTrabajador): void {
    const ocupacionesPermitidas = [
      OcupacionTrabajador.ALBANIL,
      OcupacionTrabajador.PLOMERO,
      OcupacionTrabajador.ELECTRICISTA,
    ];

    if (!ocupacionesPermitidas.includes(ocupacion)) {
      throw new BadRequestException(
        'El trabajador no tiene una ocupacion compatible con obra bruta.',
      );
    }
  }
}
