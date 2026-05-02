import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  EstadoTarea,
  OcupacionTrabajador,
  Tarea,
  TipoTarea,
} from '../../../domain';
import {
  CRONOGRAMA_REPOSITORY,
  TAREA_REPOSITORY,
  type CronogramaRepository,
  type TareaRepository,
} from '../../../infrastructure';
import { RegistrarTareaObraBrutaDto } from '../dto';

@Injectable()
export class RegistrarTareaObraBrutaUseCase {
  constructor(
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
    @Inject(CRONOGRAMA_REPOSITORY)
    private readonly cronogramaRepository: CronogramaRepository,
  ) {}

  async execute(dto: RegistrarTareaObraBrutaDto): Promise<Tarea> {
    const cronograma = await this.cronogramaRepository.findByProyecto(
      dto.idProyecto,
    );

    if (!cronograma) {
      throw new NotFoundException(
        `No se encontro un cronograma para el proyecto con id ${dto.idProyecto}.`,
      );
    }

    const fechaInicioPlanificada = new Date(dto.fechaInicioPlanificada);
    const fechaFinPlanificada = new Date(dto.fechaFinPlanificada);

    if (fechaFinPlanificada < fechaInicioPlanificada) {
      throw new BadRequestException(
        'La fecha fin planificada no puede ser anterior a la fecha inicio planificada.',
      );
    }

    if (!this.esPerfilObraBrutaValido(dto.perfilRequerido)) {
      throw new BadRequestException(
        'El perfil requerido para tareas de obra bruta debe ser ALBANIL, PLOMERO o ELECTRICISTA.',
      );
    }

    const tarea = new Tarea({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      tipoTarea: TipoTarea.OBRA_BRUTA,
      perfilRequerido: dto.perfilRequerido,
      duracionEstimada: dto.duracionEstimada,
      fechaInicioPlanificada,
      fechaFinPlanificada,
      estadoTarea: EstadoTarea.PENDIENTE,
      prioridad: dto.prioridad,
      idCronograma: cronograma.idCronograma,
    });

    return this.tareaRepository.create(tarea);
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
