export const AI_MATERIAL_ASSIGNMENT_PORT = 'AI_MATERIAL_ASSIGNMENT_PORT';

export interface MaterialDisponibleInfo {
  idMaterial: number;
  nombre: string;
  tipoMaterial?: string;
  cantidadDisponible: number;
  costoUnitario?: number;
}

export interface GenerateMaterialAssignmentParams {
  idProyecto?: number;
  idTarea?: number;
  materialesDisponibles: MaterialDisponibleInfo[];
  restricciones?: string;
  costoMaximoPermitido?: number;
}

export interface GenerateMaterialAssignmentResult {
  idMaterial: number;
  cantidadSugerida: number;
  costoEstimado?: number;
  nivelConfianza: number;
  justificacion: string;
  provider: string;
  usedFallback?: boolean;
}

export interface AiMaterialAssignmentPort {
  generateMaterialAssignment(
    params: GenerateMaterialAssignmentParams,
  ): Promise<GenerateMaterialAssignmentResult>;
}
