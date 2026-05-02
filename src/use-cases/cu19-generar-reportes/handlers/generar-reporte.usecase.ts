import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reporte, TipoReporte } from '../../../domain';
import {
  PROYECTO_REPOSITORY,
  REPORTE_REPOSITORY,
  type ProyectoRepository,
  type ReporteRepository,
} from '../../../infrastructure';
import { GenerarReporteDto } from '../dto';

@Injectable()
export class GenerarReporteUseCase {
  constructor(
    @Inject(REPORTE_REPOSITORY)
    private readonly reporteRepository: ReporteRepository,
    @Inject(PROYECTO_REPOSITORY)
    private readonly proyectoRepository: ProyectoRepository,
  ) {}

  async execute(dto: GenerarReporteDto): Promise<Reporte> {
    if (dto.idProyecto !== undefined) {
      const proyecto = await this.proyectoRepository.findById(dto.idProyecto);

      if (!proyecto) {
        throw new NotFoundException(
          `No se encontro el proyecto con id ${dto.idProyecto}.`,
        );
      }
    }

    const fechaInicioPeriodo = dto.fechaInicioPeriodo
      ? new Date(dto.fechaInicioPeriodo)
      : undefined;
    const fechaFinPeriodo = dto.fechaFinPeriodo
      ? new Date(dto.fechaFinPeriodo)
      : undefined;

    if (
      fechaInicioPeriodo &&
      fechaFinPeriodo &&
      fechaFinPeriodo < fechaInicioPeriodo
    ) {
      throw new BadRequestException(
        'La fecha fin del periodo no puede ser anterior a la fecha inicio del periodo.',
      );
    }

    const reporte = new Reporte({
      tipoReporte: dto.tipoReporte,
      fechaGeneracion: new Date(),
      fechaInicioPeriodo,
      fechaFinPeriodo,
      porcentajeAvanceGeneral:
        dto.tipoReporte === TipoReporte.AVANCE_PROYECTO ? 0 : undefined,
      contenidoResumen: this.obtenerContenidoResumen(dto.tipoReporte),
      idProyecto: dto.idProyecto,
    });

    return this.reporteRepository.create(reporte);
  }

  private obtenerContenidoResumen(tipoReporte: TipoReporte): string {
    switch (tipoReporte) {
      case TipoReporte.AVANCE_PROYECTO:
        return 'Reporte provisional de avance del proyecto.';
      case TipoReporte.MATERIALES:
        return 'Reporte provisional de materiales.';
      case TipoReporte.COSTOS:
        return 'Reporte provisional de costos.';
      case TipoReporte.ALERTAS:
        return 'Reporte provisional de alertas.';
      case TipoReporte.GENERAL:
      default:
        return 'Reporte general provisional del sistema.';
    }
  }
}
