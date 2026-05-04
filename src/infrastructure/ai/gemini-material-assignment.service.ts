/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import {
  AiMaterialAssignmentPort,
  GenerateMaterialAssignmentParams,
  GenerateMaterialAssignmentResult,
} from './ai-material-assignment.port';
import { executeHeuristicMaterialAssignment } from '../../common/utils/material-assignment-heuristic.util';

@Injectable()
export class GeminiMaterialAssignmentService implements AiMaterialAssignmentPort {
  private readonly logger = new Logger(GeminiMaterialAssignmentService.name);
  private readonly aiEnabled: boolean;
  private readonly apiKey: string;
  private readonly modelName: string;
  private readonly timeoutMs: number;
  private genAI?: GoogleGenAI;

  constructor() {
    this.aiEnabled = process.env.AI_ENABLED === 'true';
    this.apiKey = process.env.GOOGLE_AI_API_KEY || '';
    this.modelName = process.env.GOOGLE_AI_MODEL || 'gemini-2.5-flash';
    this.timeoutMs = parseInt(process.env.GOOGLE_AI_TIMEOUT_MS || '15000', 10);

    if (this.aiEnabled) {
      if (!this.apiKey) {
        this.logger.error(
          'AI_ENABLED is true pero GOOGLE_AI_API_KEY no esta configurada. Se usara fallback heurístico.',
        );
      } else {
        this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
      }
    }
  }

  async generateMaterialAssignment(
    params: GenerateMaterialAssignmentParams,
  ): Promise<GenerateMaterialAssignmentResult> {
    if (!this.aiEnabled || !this.genAI) {
      return executeHeuristicMaterialAssignment(params);
    }

    try {
      const prompt = this.buildPrompt(params);

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error('Timeout en solicitud a Gemini API')),
          this.timeoutMs,
        );
      });

      const responsePromise = this.genAI.models.generateContent({
        model: this.modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const response = await Promise.race([responsePromise, timeoutPromise]);
      const responseText = response.text;

      if (!responseText) {
        throw new Error('Respuesta vacia de Gemini API');
      }

      const result = this.parseAndValidateResponse(responseText, params);
      return result;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error al llamar a Gemini API: ${err.message}. Usando fallback heurístico.`,
      );
      return executeHeuristicMaterialAssignment(params);
    }
  }

  private buildPrompt(params: GenerateMaterialAssignmentParams): string {
    return `Eres un experto planificador de obras de construcción.
Recomienda la asignación óptima de material basándote en la siguiente información:
Proyecto ID: ${params.idProyecto ?? 'N/A'}
Tarea ID: ${params.idTarea ?? 'N/A'}
Costo máximo permitido: ${params.costoMaximoPermitido ?? 'Sin límite'}
Restricciones adicionales: ${params.restricciones ?? 'Ninguna'}

Materiales disponibles:
${JSON.stringify(params.materialesDisponibles, null, 2)}

Devuelve estrictamente un JSON con la siguiente estructura (no añadas nada más, ni markdown de código):
{
  "idMaterial": (número del ID del material elegido, debe existir en la lista),
  "cantidadSugerida": (número, mayor a 0, no debe exceder el stock disponible),
  "costoEstimado": (número, opcional, calculado en base al costoUnitario y la cantidadSugerida),
  "nivelConfianza": (número entre 0 y 100 indicando tu grado de certeza),
  "justificacion": (cadena de texto breve justificando la decisión de manera profesional)
}`;
  }

  private parseAndValidateResponse(
    jsonText: string,
    params: GenerateMaterialAssignmentParams,
  ): GenerateMaterialAssignmentResult {
    let rawData: any;
    try {
      // Remover posibles bloques de markdown
      const cleanedText = jsonText.replace(/```json\n?|\n?```/g, '').trim();
      rawData = JSON.parse(cleanedText);
    } catch {
      throw new Error('Formato JSON inválido desde la API');
    }

    if (typeof rawData.idMaterial !== 'number') {
      throw new Error('idMaterial inválido en respuesta');
    }
    if (
      typeof rawData.cantidadSugerida !== 'number' ||
      rawData.cantidadSugerida <= 0
    ) {
      throw new Error('cantidadSugerida inválida en respuesta');
    }
    if (
      typeof rawData.nivelConfianza !== 'number' ||
      rawData.nivelConfianza < 0 ||
      rawData.nivelConfianza > 100
    ) {
      throw new Error('nivelConfianza inválido en respuesta');
    }
    if (typeof rawData.justificacion !== 'string') {
      throw new Error('justificacion inválida en respuesta');
    }

    const materialEncontrado = params.materialesDisponibles.find(
      (m) => m.idMaterial === rawData.idMaterial,
    );
    if (!materialEncontrado) {
      throw new Error(
        `Material ID ${rawData.idMaterial} propuesto por IA no existe en la lista de disponibles.`,
      );
    }

    const cantidadFinal = Math.min(
      rawData.cantidadSugerida,
      materialEncontrado.cantidadDisponible,
    );

    return {
      idMaterial: rawData.idMaterial,
      cantidadSugerida: cantidadFinal,
      costoEstimado: rawData.costoEstimado as number | undefined,
      nivelConfianza: rawData.nivelConfianza,
      justificacion: rawData.justificacion,
      provider: 'google-gemini',
      usedFallback: false,
    };
  }
}
