import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
  AI_MATERIAL_ASSIGNMENT_PORT,
  type AiMaterialAssignmentPort,
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
    @Inject(AI_MATERIAL_ASSIGNMENT_PORT)
    private readonly aiMaterialAssignmentPort: AiMaterialAssignmentPort,
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
    const materialesDisponibles = materiales.map((m) => ({
      idMaterial: m.idMaterial as number,
      nombre: m.nombre,
      cantidadDisponible: m.cantidadDisponible,
      costoUnitario: m.costoUnitario,
    }));

    const recomendacion =
      await this.aiMaterialAssignmentPort.generateMaterialAssignment({
        idProyecto: dto.idProyecto,
        idTarea: dto.idTarea,
        materialesDisponibles,
        restricciones: dto.restricciones,
        costoMaximoPermitido: dto.costoMaximoPermitido,
      });

    const asignacion = new AsignacionMaterial({
      idTarea: dto.idTarea,
      idMaterial: recomendacion.idMaterial,
      cantidadAsignada: recomendacion.cantidadSugerida,
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
