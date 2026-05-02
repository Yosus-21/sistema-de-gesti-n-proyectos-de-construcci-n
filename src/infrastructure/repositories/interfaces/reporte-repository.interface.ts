import { Reporte, TipoReporte } from '../../../domain';

export interface ReporteRepositoryFindManyParams {
  idProyecto?: number;
  tipoReporte?: TipoReporte;
  pagina?: number;
  limite?: number;
}

export interface ReporteRepository {
  create: (data: Reporte) => Promise<Reporte>;
  findById: (idReporte: number) => Promise<Reporte | null>;
  findMany: (params?: ReporteRepositoryFindManyParams) => Promise<Reporte[]>;
  update: (idReporte: number, data: Partial<Reporte>) => Promise<Reporte>;
  delete: (idReporte: number) => Promise<void>;
}
