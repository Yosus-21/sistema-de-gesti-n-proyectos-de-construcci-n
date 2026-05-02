import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AsignacionMaterial, EstadoAsignacion } from '../../../domain';
import {
  ASIGNACION_MATERIAL_REPOSITORY,
  MATERIAL_REPOSITORY,
  PROYECTO_REPOSITORY,
  TAREA_REPOSITORY,
  type AsignacionMaterialRepository,
  type MaterialRepository,
  type ProyectoRepository,
  type TareaRepository,
} from '../../../infrastructure';
import { GenerarPropuestaAsignacionMaterialDto } from '../dto';

@Injectable()
export class GenerarPropuestaAsignacionMaterialUseCase {
  constructor(
    @Inject(ASIGNACION_MATERIAL_REPOSITORY)
    private readonly asignacionMaterialRepository: AsignacionMaterialRepository,
    @Inject(PROYECTO_REPOSITORY)
    private readonly proyectoRepository: ProyectoRepository,
    @Inject(TAREA_REPOSITORY)
    private readonly tareaRepository: TareaRepository,
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
  ) {}

  async execute(
    dto: GenerarPropuestaAsignacionMaterialDto,
  ): Promise<AsignacionMaterial> {
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

    const materiales = await this.materialRepository.findMany();
    const materialesDisponibles = materiales
      .filter((material) => material.cantidadDisponible > 0)
      .filter((material) =>
        dto.costoMaximoPermitido !== undefined
          ? material.costoUnitario <= dto.costoMaximoPermitido
          : true,
      )
      .sort((a, b) => b.cantidadDisponible - a.cantidadDisponible);

    if (materialesDisponibles.length === 0) {
      throw new BadRequestException(
        'No hay materiales disponibles que cumplan los criterios indicados.',
      );
    }

    const materialCandidato = materialesDisponibles[0];
    const cantidadAsignada = Math.min(materialCandidato.cantidadDisponible, 1);

    const asignacion = new AsignacionMaterial({
      idTarea: dto.idTarea,
      idMaterial: materialCandidato.idMaterial,
      cantidadAsignada,
      fechaAsignacion: new Date(),
      criteriosPrioridad: dto.criteriosPrioridad,
      costoMaximoPermitido: dto.costoMaximoPermitido,
      restricciones: dto.restricciones,
      estadoAsignacion: EstadoAsignacion.PENDIENTE,
      generadaPorIa: true,
    });

    return this.asignacionMaterialRepository.create(asignacion);
  }
}
