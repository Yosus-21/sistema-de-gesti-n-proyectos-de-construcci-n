/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import { GeminiMaterialForecastService } from '../gemini-material-forecast.service';

jest.mock('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => {
      return {
        models: {
          generateContent: jest.fn(),
        },
      };
    }),
  };
});

describe('GeminiMaterialForecastService', () => {
  let service: GeminiMaterialForecastService;
  const oldEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...oldEnv };
  });

  afterAll(() => {
    process.env = oldEnv;
  });

  const getParams = () => ({
    idProyecto: 1,
    material: { idMaterial: 1, nombre: 'Cemento', cantidadDisponible: 100 },
  });

  it('usa fallback cuando AI_ENABLED es false', async () => {
    process.env.AI_ENABLED = 'false';
    service = new GeminiMaterialForecastService();

    const result = await service.generateMaterialForecast(getParams());

    expect(result.usedFallback).toBe(true);
    expect(result.provider).toBe('heuristic');
  });

  it('usa fallback cuando falta GOOGLE_AI_API_KEY pero AI_ENABLED es true', async () => {
    process.env.AI_ENABLED = 'true';
    process.env.GOOGLE_AI_API_KEY = '';
    service = new GeminiMaterialForecastService();

    const result = await service.generateMaterialForecast(getParams());

    expect(result.usedFallback).toBe(true);
  });

  it('acepta respuesta valida de Gemini', async () => {
    process.env.AI_ENABLED = 'true';
    process.env.GOOGLE_AI_API_KEY = 'test-key';
    service = new GeminiMaterialForecastService();

    const genAIInstance = (service as any).genAI;
    genAIInstance.models.generateContent.mockResolvedValue({
      text: JSON.stringify({
        stockMinimo: 10,
        stockMaximo: 50,
        nivelConfianza: 90,
        riesgo: 'BAJO',
        justificacion: 'Analisis estacional OK',
      }),
    });

    const result = await service.generateMaterialForecast(getParams());

    expect(result.usedFallback).toBe(false);
    expect(result.provider).toBe('google-gemini');
    expect(result.stockMinimo).toBe(10);
    expect(result.riesgo).toBe('BAJO');
  });

  it('usa fallback si la API falla o JSON es invalido', async () => {
    process.env.AI_ENABLED = 'true';
    process.env.GOOGLE_AI_API_KEY = 'test-key';
    service = new GeminiMaterialForecastService();

    const genAIInstance = (service as any).genAI;
    genAIInstance.models.generateContent.mockRejectedValue(
      new Error('API Down'),
    );

    const result = await service.generateMaterialForecast(getParams());

    expect(result.usedFallback).toBe(true);
  });
});
