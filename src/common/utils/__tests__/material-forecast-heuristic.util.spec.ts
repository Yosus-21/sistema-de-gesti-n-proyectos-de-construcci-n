import { BadRequestException } from '@nestjs/common';
import { executeHeuristicMaterialForecast } from '../material-forecast-heuristic.util';

describe('executeHeuristicMaterialForecast', () => {
  it('lanza BadRequestException si stockMaximo < stockMinimo', () => {
    expect(() =>
      executeHeuristicMaterialForecast({
        stockMinimo: 50,
        stockMaximo: 20,
      }),
    ).toThrow(BadRequestException);
  });

  it('calcula stock optimo si no se provee', () => {
    const result = executeHeuristicMaterialForecast({
      material: {
        idMaterial: 1,
        nombre: 'Cemento',
        cantidadDisponible: 100,
      },
    });

    expect(result.stockMinimo).toBe(20); // 100 * 0.2
    expect(result.stockMaximo).toBe(150); // 100 * 1.5
    expect(result.nivelConfianza).toBe(85); // 100 está entre 20 y 150
    expect(result.riesgo).toBe('BAJO');
    expect(result.usedFallback).toBe(true);
    expect(result.provider).toBe('heuristic');
  });

  it('respeta stockMinimo y stockMaximo proveidos y ajusta confianza', () => {
    const result = executeHeuristicMaterialForecast({
      stockMinimo: 10,
      stockMaximo: 20,
      material: {
        idMaterial: 1,
        nombre: 'Cemento',
        cantidadDisponible: 5,
      },
    });

    expect(result.stockMinimo).toBe(10);
    expect(result.stockMaximo).toBe(20);
    expect(result.nivelConfianza).toBe(60); // 5 < 10
    expect(result.riesgo).toBe('ALTO');
  });

  it('devuelve fallback con cantidad disponible 0 o undefined', () => {
    const result = executeHeuristicMaterialForecast({});

    expect(result.stockMinimo).toBe(10);
    expect(result.stockMaximo).toBe(50);
    expect(result.nivelConfianza).toBe(60); // 0 < 10
    expect(result.riesgo).toBe('ALTO');
  });
});
