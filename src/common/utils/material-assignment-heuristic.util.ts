import { BadRequestException } from '@nestjs/common';
import type {
  GenerateMaterialAssignmentParams,
  GenerateMaterialAssignmentResult,
} from '../../infrastructure/ai/ai-material-assignment.port';

export function executeHeuristicMaterialAssignment(
  params: GenerateMaterialAssignmentParams,
): GenerateMaterialAssignmentResult {
  const materialesDisponibles = params.materialesDisponibles
    .filter((material) => material.cantidadDisponible > 0)
    .filter((material) =>
      params.costoMaximoPermitido !== undefined &&
      material.costoUnitario !== undefined
        ? material.costoUnitario <= params.costoMaximoPermitido
        : true,
    )
    .sort((a, b) => b.cantidadDisponible - a.cantidadDisponible);

  if (materialesDisponibles.length === 0) {
    throw new BadRequestException(
      'No hay materiales disponibles que cumplan los criterios indicados.',
    );
  }

  const materialCandidato = materialesDisponibles[0];
  const cantidadAsignada = Math.min(materialCandidato.cantidadDisponible, 1);
  const costoEstimado = materialCandidato.costoUnitario
    ? materialCandidato.costoUnitario * cantidadAsignada
    : undefined;

  return {
    idMaterial: materialCandidato.idMaterial,
    cantidadSugerida: cantidadAsignada,
    costoEstimado,
    nivelConfianza: 50,
    justificacion:
      'Asignación generada usando heurística interna provisional por fallo o desactivación de IA. Se priorizó el material con mayor stock disponible que cumple las restricciones de costo.',
    provider: 'heuristic',
    usedFallback: true,
  };
}
