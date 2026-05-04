import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PronosticoMaterial } from '../../../domain';
import {
  MATERIAL_REPOSITORY,
  PRONOSTICO_MATERIAL_REPOSITORY,
  PROYECTO_REPOSITORY,
  type MaterialRepository,
  type PronosticoMaterialRepository,
  type ProyectoRepository,
  AI_MATERIAL_FORECAST_PORT,
  type AiMaterialForecastPort,
} from '../../../infrastructure';
import { GenerarPronosticoMaterialDto } from '../dto';

@Injectable()
export class GenerarPronosticoMaterialUseCase {
  constructor(
    @Inject(PRONOSTICO_MATERIAL_REPOSITORY)
    private readonly pronosticoMaterialRepository: PronosticoMaterialRepository,
    @Inject(PROYECTO_REPOSITORY)
    private readonly proyectoRepository: ProyectoRepository,
    @Inject(MATERIAL_REPOSITORY)
    private readonly materialRepository: MaterialRepository,
    @Inject(AI_MATERIAL_FORECAST_PORT)
    private readonly aiMaterialForecastPort: AiMaterialForecastPort,
  ) {}

  async execute(
    dto: GenerarPronosticoMaterialDto,
  ): Promise<PronosticoMaterial> {
    const proyecto = await this.proyectoRepository.findById(dto.idProyecto);

    if (!proyecto) {
      throw new NotFoundException(
        `No se encontro el proyecto con id ${dto.idProyecto}.`,
      );
    }

    const material =
      dto.idMaterial !== undefined
        ? await this.materialRepository.findById(dto.idMaterial)
        : null;

    if (dto.idMaterial !== undefined && !material) {
      throw new NotFoundException(
        `No se encontro el material con id ${dto.idMaterial}.`,
      );
    }

    if (dto.stockMinimo !== undefined && dto.stockMaximo !== undefined) {
      if (dto.stockMinimo < 0 || dto.stockMaximo < 0) {
        throw new BadRequestException(
          'Los valores de stock mínimo y stock máximo no pueden ser negativos.',
        );
      }
      if (dto.stockMaximo < dto.stockMinimo) {
        throw new BadRequestException(
          'El stock máximo no puede ser menor que el stock mínimo.',
        );
      }
    }

    const forecastResult =
      await this.aiMaterialForecastPort.generateMaterialForecast({
        idProyecto: dto.idProyecto,
        material: material
          ? {
              idMaterial: material.idMaterial as number,
              nombre: material.nombre,
              tipoMaterial: material.tipoMaterial,
              cantidadDisponible: material.cantidadDisponible,
              costoUnitario: material.costoUnitario,
            }
          : undefined,
        periodoAnalisis: dto.periodoAnalisis,
        stockMinimo: dto.stockMinimo,
        stockMaximo: dto.stockMaximo,
        observaciones: dto.observaciones,
      });

    const observacionesBase = dto.observaciones
      ? `${dto.observaciones} | `
      : '';
    const justificacionCompleta = `${observacionesBase}${forecastResult.justificacion}`;

    const pronostico = new PronosticoMaterial({
      idProyecto: dto.idProyecto,
      idMaterial: dto.idMaterial,
      periodoAnalisis: dto.periodoAnalisis,
      stockMinimo: forecastResult.stockMinimo,
      stockMaximo: forecastResult.stockMaximo,
      fechaGeneracion: new Date(),
      nivelConfianza: forecastResult.nivelConfianza,
      observaciones: justificacionCompleta,
    });

    return this.pronosticoMaterialRepository.create(pronostico);
  }
}
