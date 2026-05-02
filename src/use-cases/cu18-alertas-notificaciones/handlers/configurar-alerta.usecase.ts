import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Alerta, EstadoAlerta } from '../../../domain';
import {
  ALERTA_REPOSITORY,
  MATERIAL_REPOSITORY,
  PROYECTO_REPOSITORY,
  TAREA_REPOSITORY,
  type AlertaRepository,
  type MaterialRepository,
  type ProyectoRepository,
  type TareaRepository,
} from '../../../infrastructure';
import { ConfigurarAlertaDto } from '../dto';

@Injectable()
export class ConfigurarAlertaUseCase {
  constructor(
    @Inject(ALERTA_REPOSITORY)
    private readonly alertaRepository: AlertaRepository,
    @Inject(PROYECTO_REPOSITORY)
    private readonly proyectoRepository: ProyectoRepository,
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(dto: ConfigurarAlertaDto): Promise<Alerta> {
    if (
      dto.idProyecto === undefined &&
      dto.idTarea === undefined &&
      dto.idMaterial === undefined
    ) {
      throw new BadRequestException(
        'Debe informar al menos un destino para la alerta: proyecto, tarea o material.',
      );
    }

    if (dto.idProyecto !== undefined) {
      const proyecto = await this.proyectoRepository.findById(dto.idProyecto);

      if (!proyecto) {
        throw new NotFoundException(
          `No se encontro el proyecto con id ${dto.idProyecto}.`,
        );
      }
    }

    if (dto.idTarea !== undefined) {
      const tarea = await this.tareaRepository.findById(dto.idTarea);

      if (!tarea) {
        throw new NotFoundException(
          `No se encontro la tarea con id ${dto.idTarea}.`,
        );
      }
    }

    if (dto.idMaterial !== undefined) {
      const material = await this.materialRepository.findById(dto.idMaterial);

      if (!material) {
        throw new NotFoundException(
          `No se encontro el material con id ${dto.idMaterial}.`,
        );
      }
    }

    const alerta = new Alerta({
      criterioActivacion: dto.criterioActivacion,
      tipoAlerta: dto.tipoAlerta,
      estadoAlerta: EstadoAlerta.ACTIVA,
      mensajeNotificacion: dto.mensajeNotificacion,
      metodoNotificacion: dto.metodoNotificacion,
      fechaGeneracion: new Date(),
      idProyecto: dto.idProyecto,
      idTarea: dto.idTarea,
      idMaterial: dto.idMaterial,
    });

    return this.alertaRepository.create(alerta);
  }
}
