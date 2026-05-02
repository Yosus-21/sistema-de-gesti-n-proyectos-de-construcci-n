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

    const nivelConfianza = this.calcularNivelConfianzaHeuristico(
      material?.cantidadDisponible,
      dto.stockMinimo,
      dto.stockMaximo,
    );

    const pronostico = new PronosticoMaterial({
      idProyecto: dto.idProyecto,
      idMaterial: dto.idMaterial,
      periodoAnalisis: dto.periodoAnalisis,
      stockMinimo: dto.stockMinimo,
      stockMaximo: dto.stockMaximo,
      fechaGeneracion: new Date(),
      nivelConfianza,
      observaciones:
        dto.observaciones ??
        'Pronóstico generado con heurística provisional de IA para planificación de materiales.',
    });

    return this.pronosticoMaterialRepository.create(pronostico);
  }

  private calcularNivelConfianzaHeuristico(
    cantidadDisponible: number | undefined,
    stockMinimo: number,
    stockMaximo: number,
  ): number {
    if (cantidadDisponible === undefined) {
      return 70;
    }

    if (
      cantidadDisponible >= stockMinimo &&
      cantidadDisponible <= stockMaximo
    ) {
      return 85;
    }

    if (cantidadDisponible < stockMinimo) {
      return 60;
    }

    if (cantidadDisponible > stockMaximo) {
      return 75;
    }

    return 70;
  }
}
