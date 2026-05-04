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
import { TrabajadorDisponibilidadService } from '../../shared';
import { AsignarTareaObraBrutaDto } from '../dto';

@Injectable()
export class AsignarTareaObraBrutaUseCase {
  constructor(
    @Inject(ASIGNACION_TAREA_REPOSITORY)
    private readonly asignacionTareaRepository: AsignacionTareaRepository,
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
    @Inject(TRABAJADOR_REPOSITORY)
    private readonly trabajadorRepository: TrabajadorRepository,
    private readonly trabajadorDisponibilidadService: TrabajadorDisponibilidadService,
  ) {}

  async execute(dto: AsignarTareaObraBrutaDto): Promise<AsignacionTarea> {
    const tarea = await this.tareaRepository.findById(dto.idTarea);

    if (!tarea) {
      throw new NotFoundException(
        `No se encontro la tarea con id ${dto.idTarea}.`,
      );
    }

    if (tarea.tipoTarea !== TipoTarea.OBRA_BRUTA) {
      throw new BadRequestException(
        'La tarea indicada no corresponde a una tarea de obra bruta.',
      );
    }

    const trabajador = await this.trabajadorRepository.findById(
      dto.idTrabajador,
    );

    if (!trabajador) {
      throw new NotFoundException(
        `No se encontro el trabajador con id ${dto.idTrabajador}.`,
      );
    }

    this.validarOcupacionCompatible(trabajador.ocupacion);

    const yaExiste =
      await this.asignacionTareaRepository.existsActiveAssignment(
        dto.idTarea,
        dto.idTrabajador,
      );

    if (yaExiste) {
      throw new ConflictException(
        'Ya existe una asignacion activa para este trabajador en la tarea indicada.',
      );
    }

    await this.trabajadorDisponibilidadService.validarDisponibleParaTarea(
      dto.idTrabajador,
      tarea,
    );

    const asignacion = new AsignacionTarea({
      idTarea: dto.idTarea,
      idTrabajador: dto.idTrabajador,
      fechaAsignacion: new Date(dto.fechaAsignacion),
      rolEnLaTarea: dto.rolEnLaTarea,
      estadoAsignacion: EstadoAsignacion.CONFIRMADA,
      observaciones: dto.observaciones,
      asignadaPorContratista: false,
    });

    return this.asignacionTareaRepository.create(asignacion);
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
