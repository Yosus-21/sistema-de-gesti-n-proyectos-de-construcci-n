/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import {
  AiMaterialForecastPort,
  GenerateMaterialForecastParams,
  GenerateMaterialForecastResult,
} from './ai-material-forecast.port';
import { executeHeuristicMaterialForecast } from '../../common/utils/material-forecast-heuristic.util';

@Injectable()
export class GeminiMaterialForecastService implements AiMaterialForecastPort {
  private readonly logger = new Logger(GeminiMaterialForecastService.name);
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
          'AI_ENABLED is true pero GOOGLE_AI_API_KEY no esta configurada. Se usara fallback heurístico para pronósticos.',
        );
      } else {
        this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
      }
    }
  }

  async generateMaterialForecast(
    params: GenerateMaterialForecastParams,
  ): Promise<GenerateMaterialForecastResult> {
    if (!this.aiEnabled || !this.genAI) {
      return executeHeuristicMaterialForecast(params);
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

      const result = this.parseAndValidateResponse(responseText);
      return result;
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error al llamar a Gemini API en pronostico: ${err.message}. Usando fallback heurístico.`,
      );
      return executeHeuristicMaterialForecast(params);
    }
  }

  private buildPrompt(params: GenerateMaterialForecastParams): string {
    return `Eres un analista de datos y logistica en construccion.
Estima el pronostico de demanda de materiales con los siguientes datos:
Proyecto ID: ${params.idProyecto ?? 'N/A'}
Material: ${params.material ? JSON.stringify(params.material) : 'No especificado'}
Periodo de analisis: ${params.periodoAnalisis ?? 'General'}
Observaciones previas: ${params.observaciones ?? 'Ninguna'}
Stock minimo solicitado: ${params.stockMinimo ?? 'Calcular optimo'}
Stock maximo solicitado: ${params.stockMaximo ?? 'Calcular optimo'}

Devuelve estrictamente un JSON con la siguiente estructura (no añadas nada mas, ni markdown de codigo):
{
  "stockMinimo": (numero mayor o igual a 0),
  "stockMaximo": (numero mayor o igual a stockMinimo),
  "nivelConfianza": (numero entre 0 y 100 indicando certeza predictiva),
  "riesgo": (cadena, solo puede ser "BAJO", "MEDIO" o "ALTO"),
  "justificacion": (cadena de texto justificando la estimacion)
}`;
  }

  private parseAndValidateResponse(
    jsonText: string,
  ): GenerateMaterialForecastResult {
    let rawData: any;
    try {
      const cleanedText = jsonText.replace(/```json\n?|\n?```/g, '').trim();
      rawData = JSON.parse(cleanedText);
    } catch {
      throw new Error('Formato JSON invalido desde la API');
    }

    if (typeof rawData.stockMinimo !== 'number' || rawData.stockMinimo < 0) {
      throw new Error('stockMinimo invalido');
    }
    if (
      typeof rawData.stockMaximo !== 'number' ||
      rawData.stockMaximo < rawData.stockMinimo
    ) {
      throw new Error('stockMaximo invalido');
    }
    if (
      typeof rawData.nivelConfianza !== 'number' ||
      rawData.nivelConfianza < 0 ||
      rawData.nivelConfianza > 100
    ) {
      throw new Error('nivelConfianza invalido');
    }
    if (!['BAJO', 'MEDIO', 'ALTO'].includes(rawData.riesgo)) {
      throw new Error('riesgo invalido');
    }
    if (typeof rawData.justificacion !== 'string') {
      throw new Error('justificacion invalida');
    }

    return {
      stockMinimo: rawData.stockMinimo,
      stockMaximo: rawData.stockMaximo,
      nivelConfianza: rawData.nivelConfianza,
      riesgo: rawData.riesgo as 'BAJO' | 'MEDIO' | 'ALTO',
      justificacion: rawData.justificacion,
      provider: 'google-gemini',
      usedFallback: false,
    };
  }
}
