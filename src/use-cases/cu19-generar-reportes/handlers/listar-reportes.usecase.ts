import { Inject, Injectable } from '@nestjs/common';
import { Reporte } from '../../../domain';
import {
  REPORTE_REPOSITORY,
  type ReporteRepository,
} from '../../../infrastructure';
import { ListarReportesDto } from '../dto';

@Injectable()
export class ListarReportesUseCase {
  constructor(
    @Inject(REPORTE_REPOSITORY)
    private readonly reporteRepository: ReporteRepository,
  ) {}

  async execute(dto: ListarReportesDto): Promise<Reporte[]> {
    return this.reporteRepository.findMany({
      idProyecto: dto.idProyecto,
      tipoReporte: dto.tipoReporte,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
