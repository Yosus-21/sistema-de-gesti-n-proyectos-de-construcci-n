import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
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

describe('CU13 Gestion de Informacion de Proveedores (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let authHeaders: { Authorization: string };
  let proveedorCreadoId: number | undefined;

  const timestamp = Date.now();
  const nombreProveedorPrueba = `Proveedor e2e-cu13 ${timestamp}`;
  const nombreProveedorActualizado = `Proveedor actualizado e2e-cu13 ${timestamp}`;
  const correoProveedorPrueba = `proveedor-e2e-cu13-${timestamp}@example.com`;
  const correoProveedorActualizado = `proveedor-actualizado-e2e-cu13-${timestamp}@example.com`;

  const cleanupTestData = async () => {
    await prismaService.proveedor.deleteMany({
      where: {
        OR: [
          {
            nombre: {
              contains: 'e2e-cu13',
            },
          },
          {
            correo: {
              contains: 'e2e-cu13',
            },
          },
        ],
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
      'e2e-cu13-auth',
    );
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo completo de CU13', async () => {
    const api = createAuthorizedRequest(app, authHeaders);
    const createResponse = await api
      .post('/cu13/proveedores')
      .send({
        nombre: nombreProveedorPrueba,
        direccion: 'Av. Proveedor 123',
        telefono: '76540000',
        correo: correoProveedorPrueba,
        terminosEntrega: 'Entrega en 72 horas',
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idProveedor: expectAnyNumber(),
        nombre: nombreProveedorPrueba,
        correo: correoProveedorPrueba,
        terminosEntrega: 'Entrega en 72 horas',
      }),
    });

    const createResponseBody = getSuccessBody<{ idProveedor: number }>(
      createResponse,
    );

    proveedorCreadoId = createResponseBody.data.idProveedor;

    await api
      .post('/cu13/proveedores')
      .send({
        nombre: nombreProveedorPrueba,
        direccion: 'Otra direccion',
        telefono: '76540001',
        correo: correoProveedorPrueba,
      })
      .expect(409)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 409,
          timestamp: expectAnyString(),
          path: '/cu13/proveedores',
          message:
            'Ya existe un proveedor registrado con el mismo nombre o correo.',
          errors: [],
        });
      });

    await api
      .get('/cu13/proveedores')
      .query({
        busqueda: 'e2e-cu13',
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<Array<{ idProveedor: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (proveedor: { idProveedor: number }) =>
              proveedor.idProveedor === proveedorCreadoId,
          ),
        ).toBe(true);
      });

    await api
      .get(`/cu13/proveedores/${proveedorCreadoId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idProveedor: proveedorCreadoId,
            nombre: nombreProveedorPrueba,
            correo: correoProveedorPrueba,
          }),
        });
      });

    await api
      .patch(`/cu13/proveedores/${proveedorCreadoId}`)
      .send({
        nombre: nombreProveedorActualizado,
        telefono: '76549999',
        correo: correoProveedorActualizado,
        terminosEntrega: 'Entrega en 24 horas',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idProveedor: proveedorCreadoId,
            nombre: nombreProveedorActualizado,
            telefono: '76549999',
            correo: correoProveedorActualizado,
            terminosEntrega: 'Entrega en 24 horas',
          }),
        });
      });

    await api
      .get(`/cu13/proveedores/${proveedorCreadoId}/validar`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            idProveedor: proveedorCreadoId,
            valido: true,
            mensaje:
              'Proveedor registrado y disponible para órdenes de compra.',
          },
        });
      });

    await api
      .delete(`/cu13/proveedores/${proveedorCreadoId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            eliminado: true,
            idProveedor: proveedorCreadoId,
          },
        });
      });

    await api
      .get(`/cu13/proveedores/${proveedorCreadoId}`)
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: `/cu13/proveedores/${proveedorCreadoId}`,
          message: `No se encontro el proveedor con id ${proveedorCreadoId}.`,
          errors: [],
        });
      });
  });
});
