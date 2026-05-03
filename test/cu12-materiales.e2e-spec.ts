import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import { TipoMaterial } from './../src/domain';
import { PrismaService } from './../src/infrastructure';
import {
  expectAnyNumber,
  expectAnyString,
  expectObjectContaining,
  getSuccessBody,
} from './helpers/e2e-response.types';
import {
  createAuthorizedRequest,
  getAdminAuthHeaders,
} from './helpers/auth-e2e.helper';

describe('CU12 Registro de Materiales (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let authHeaders: { Authorization: string };
  let materialCreadoId: number | undefined;

  const timestamp = Date.now();
  const nombreMaterialPrueba = `Material e2e-cu12 ${timestamp}`;
  const nombreMaterialActualizado = `Material actualizado e2e-cu12 ${timestamp}`;

  const cleanupTestData = async () => {
    await prismaService.material.deleteMany({
      where: {
        nombre: {
          contains: 'e2e-cu12',
        },
      },
    });
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    prismaService = app.get(PrismaService);
    authHeaders = await getAdminAuthHeaders(
      app,
      prismaService,
      'e2e-cu12-auth',
    );
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo completo de CU12', async () => {
    const api = createAuthorizedRequest(app, authHeaders);
    const createResponse = await api
      .post('/cu12/materiales')
      .send({
        nombre: nombreMaterialPrueba,
        descripcion: 'Material de prueba E2E CU12',
        tipoMaterial: TipoMaterial.GENERAL,
        unidad: 'unidad',
        cantidadDisponible: 50,
        costoUnitario: 120.5,
        especificacionesTecnicas: 'Especificaciones iniciales',
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idMaterial: expectAnyNumber(),
        nombre: nombreMaterialPrueba,
        tipoMaterial: TipoMaterial.GENERAL,
        cantidadDisponible: 50,
        costoUnitario: 120.5,
      }),
    });

    const createResponseBody = getSuccessBody<{ idMaterial: number }>(
      createResponse,
    );

    materialCreadoId = createResponseBody.data.idMaterial;

    await api
      .post('/cu12/materiales')
      .send({
        nombre: nombreMaterialPrueba,
        descripcion: 'Material duplicado',
        tipoMaterial: TipoMaterial.GENERAL,
        unidad: 'unidad',
        cantidadDisponible: 10,
        costoUnitario: 5,
      })
      .expect(409)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 409,
          timestamp: expectAnyString(),
          path: '/cu12/materiales',
          message: 'Ya existe un material registrado con el mismo nombre.',
          errors: [],
        });
      });

    await api
      .get('/cu12/materiales')
      .query({
        tipoMaterial: TipoMaterial.GENERAL,
        busqueda: 'e2e-cu12',
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<Array<{ idMaterial: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (material: { idMaterial: number }) =>
              material.idMaterial === materialCreadoId,
          ),
        ).toBe(true);
      });

    await api
      .get(`/cu12/materiales/${materialCreadoId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idMaterial: materialCreadoId,
            nombre: nombreMaterialPrueba,
            tipoMaterial: TipoMaterial.GENERAL,
          }),
        });
      });

    await api
      .patch(`/cu12/materiales/${materialCreadoId}`)
      .send({
        nombre: nombreMaterialActualizado,
        descripcion: 'Material de prueba E2E CU12 actualizado',
        costoUnitario: 135.75,
        especificacionesTecnicas: 'Especificaciones actualizadas',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idMaterial: materialCreadoId,
            nombre: nombreMaterialActualizado,
            descripcion: 'Material de prueba E2E CU12 actualizado',
            costoUnitario: 135.75,
            especificacionesTecnicas: 'Especificaciones actualizadas',
          }),
        });
      });

    await api
      .patch(`/cu12/materiales/${materialCreadoId}/stock`)
      .send({
        cantidad: 15,
        motivo: 'Ingreso de almacen',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idMaterial: materialCreadoId,
            cantidadDisponible: 65,
          }),
        });
      });

    await api
      .patch(`/cu12/materiales/${materialCreadoId}/stock`)
      .send({
        cantidad: -10,
        motivo: 'Salida a obra',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idMaterial: materialCreadoId,
            cantidadDisponible: 55,
          }),
        });
      });

    await api
      .patch(`/cu12/materiales/${materialCreadoId}/stock`)
      .send({
        cantidad: -100,
        motivo: 'Ajuste invalido',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: `/cu12/materiales/${materialCreadoId}/stock`,
          message: 'El stock no puede quedar en un valor negativo.',
          errors: [],
        });
      });

    await api
      .get(`/cu12/materiales/${materialCreadoId}/disponibilidad`)
      .query({
        cantidadRequerida: 50,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            idMaterial: materialCreadoId,
            cantidadDisponible: 55,
            cantidadRequerida: 50,
            disponible: true,
          },
        });
      });

    await api
      .delete(`/cu12/materiales/${materialCreadoId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            eliminado: true,
            idMaterial: materialCreadoId,
          },
        });
      });

    await api
      .get(`/cu12/materiales/${materialCreadoId}`)
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: `/cu12/materiales/${materialCreadoId}`,
          message: `No se encontro el material con id ${materialCreadoId}.`,
          errors: [],
        });
      });
  });
});
