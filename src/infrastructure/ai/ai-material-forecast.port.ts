export const AI_MATERIAL_FORECAST_PORT = 'AI_MATERIAL_FORECAST_PORT';

export interface ForecastMaterialInfo {
  idMaterial: number;
  nombre: string;
  tipoMaterial?: string;
  cantidadDisponible?: number;
  costoUnitario?: number;
}

export interface GenerateMaterialForecastParams {
  idProyecto?: number;
  material?: ForecastMaterialInfo;
  periodoAnalisis?: string;
  stockMinimo?: number;
  stockMaximo?: number;
  observaciones?: string;
}

export interface GenerateMaterialForecastResult {
  stockMinimo: number;
  stockMaximo: number;
  nivelConfianza: number;
  riesgo?: 'BAJO' | 'MEDIO' | 'ALTO';
  justificacion: string;
  provider: string;
  usedFallback?: boolean;
}

export interface AiMaterialForecastPort {
  generateMaterialForecast(
    params: GenerateMaterialForecastParams,
  ): Promise<GenerateMaterialForecastResult>;
}
