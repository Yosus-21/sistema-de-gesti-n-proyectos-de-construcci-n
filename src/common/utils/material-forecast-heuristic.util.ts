import { BadRequestException } from '@nestjs/common';
import type {
  GenerateMaterialForecastParams,
  GenerateMaterialForecastResult,
} from '../../infrastructure/ai/ai-material-forecast.port';

export function executeHeuristicMaterialForecast(
  params: GenerateMaterialForecastParams,
): GenerateMaterialForecastResult {
  if (
    params.stockMinimo !== undefined &&
    params.stockMaximo !== undefined &&
    params.stockMaximo < params.stockMinimo
  ) {
    throw new BadRequestException(
      'El stock máximo no puede ser menor que el stock mínimo.',
    );
  }

  const cantidad = params.material?.cantidadDisponible ?? 0;

  const stockMinimoFinal =
    params.stockMinimo ?? (cantidad > 0 ? Math.floor(cantidad * 0.2) : 10);
  let stockMaximoFinal =
    params.stockMaximo ?? (cantidad > 0 ? Math.floor(cantidad * 1.5) : 50);

  if (stockMaximoFinal < stockMinimoFinal) {
    stockMaximoFinal = stockMinimoFinal;
  }

  let nivelConfianza = 70;
  if (cantidad >= stockMinimoFinal && cantidad <= stockMaximoFinal) {
    nivelConfianza = 85;
  } else if (cantidad < stockMinimoFinal) {
    nivelConfianza = 60;
  } else if (cantidad > stockMaximoFinal) {
    nivelConfianza = 75;
  }

  let riesgo: 'BAJO' | 'MEDIO' | 'ALTO' = 'MEDIO';
  if (nivelConfianza >= 80) riesgo = 'BAJO';
  else if (nivelConfianza < 65) riesgo = 'ALTO';

  return {
    stockMinimo: Math.max(0, stockMinimoFinal),
    stockMaximo: Math.max(0, stockMaximoFinal),
    nivelConfianza,
    riesgo,
    justificacion:
      'Pronóstico generado con heurística interna provisional por fallo o desactivación de IA.',
    provider: 'heuristic',
    usedFallback: true,
  };
}
