import { BadRequestException } from '@nestjs/common';
import { executeHeuristicMaterialAssignment } from '../material-assignment-heuristic.util';

describe('executeHeuristicMaterialAssignment', () => {
  const materialesDisponibles = [
    {
      idMaterial: 1,
      nombre: 'Material A',
      cantidadDisponible: 10,
      costoUnitario: 50,
    },
    {
      idMaterial: 2,
      nombre: 'Material B',
      cantidadDisponible: 20,
      costoUnitario: 100,
    },
    {
      idMaterial: 3,
      nombre: 'Material Sin Stock',
      cantidadDisponible: 0,
      costoUnitario: 10,
    },
  ];

  it('elige el material con mayor stock que cumple restricciones', () => {
    const result = executeHeuristicMaterialAssignment({
      materialesDisponibles,
      costoMaximoPermitido: 150,
    });

    expect(result.idMaterial).toBe(2);
    expect(result.cantidadSugerida).toBe(1);
    expect(result.costoEstimado).toBe(100);
    expect(result.provider).toBe('heuristic');
    expect(result.usedFallback).toBe(true);
  });

  it('respeta el costo maximo permitido', () => {
    const result = executeHeuristicMaterialAssignment({
      materialesDisponibles,
      costoMaximoPermitido: 80, // Solo Material A cumple
    });

    expect(result.idMaterial).toBe(1);
    expect(result.cantidadSugerida).toBe(1);
  });

  it('lanza BadRequestException si no hay materiales', () => {
    expect(() =>
      executeHeuristicMaterialAssignment({
        materialesDisponibles,
        costoMaximoPermitido: 5,
      }),
    ).toThrow(BadRequestException);
  });
});
