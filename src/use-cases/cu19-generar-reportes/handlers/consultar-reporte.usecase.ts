import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Reporte } from '../../../domain';
import {
  REPORTE_REPOSITORY,
  type ReporteRepository,
} from '../../../infrastructure';
import { ConsultarReporteDto } from '../dto';

@Injectable()
export class ConsultarReporteUseCase {
  constructor(
    @Inject(REPORTE_REPOSITORY)
    private readonly reporteRepository: ReporteRepository,
  ) {}

  async execute(dto: ConsultarReporteDto): Promise<Reporte> {
    const reporte = await this.reporteRepository.findById(dto.idReporte);

    if (!reporte) {
      throw new NotFoundException(
        `No se encontro el reporte con id ${dto.idReporte}.`,
      );
    }

    return reporte;
  }
}
