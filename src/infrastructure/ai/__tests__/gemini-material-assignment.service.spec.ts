/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import { GeminiMaterialAssignmentService } from '../gemini-material-assignment.service';

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

describe('GeminiMaterialAssignmentService', () => {
  let service: GeminiMaterialAssignmentService;
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
    idTarea: 2,
    materialesDisponibles: [
      {
        idMaterial: 1,
        nombre: 'Cemento',
        cantidadDisponible: 10,
        costoUnitario: 50,
      },
      {
        idMaterial: 2,
        nombre: 'Fierro',
        cantidadDisponible: 5,
        costoUnitario: 100,
      },
    ],
    costoMaximoPermitido: 200,
  });

  it('usa fallback cuando AI_ENABLED es false', async () => {
    process.env.AI_ENABLED = 'false';
    service = new GeminiMaterialAssignmentService();

    const result = await service.generateMaterialAssignment(getParams());

    expect(result.usedFallback).toBe(true);
    expect(result.provider).toBe('heuristic');
    // La heurística elegirá Cemento (id 1) porque tiene mayor stock (10 vs 5)
    expect(result.idMaterial).toBe(1);
  });

  it('usa fallback cuando falta GOOGLE_AI_API_KEY pero AI_ENABLED es true', async () => {
    process.env.AI_ENABLED = 'true';
    process.env.GOOGLE_AI_API_KEY = '';
    service = new GeminiMaterialAssignmentService();

    const result = await service.generateMaterialAssignment(getParams());

    expect(result.usedFallback).toBe(true);
  });

  it('acepta respuesta valida de Gemini', async () => {
    process.env.AI_ENABLED = 'true';
    process.env.GOOGLE_AI_API_KEY = 'test-key';
    service = new GeminiMaterialAssignmentService();

    const genAIInstance = (service as any).genAI;
    genAIInstance.models.generateContent.mockResolvedValue({
      text: JSON.stringify({
        idMaterial: 2,
        cantidadSugerida: 2,
        costoEstimado: 200,
        nivelConfianza: 90,
        justificacion: 'Perfecto para la obra',
      }),
    });

    const result = await service.generateMaterialAssignment(getParams());

    expect(result.usedFallback).toBe(false);
    expect(result.provider).toBe('google-gemini');
    expect(result.idMaterial).toBe(2);
    expect(result.cantidadSugerida).toBe(2);
    expect(result.justificacion).toBe('Perfecto para la obra');
  });

  it('usa fallback si la API falla o JSON es invalido', async () => {
    process.env.AI_ENABLED = 'true';
    process.env.GOOGLE_AI_API_KEY = 'test-key';
    service = new GeminiMaterialAssignmentService();

    const genAIInstance = (service as any).genAI;
    genAIInstance.models.generateContent.mockRejectedValue(
      new Error('API Down'),
    );

    const result = await service.generateMaterialAssignment(getParams());

    expect(result.usedFallback).toBe(true);
  });
});
