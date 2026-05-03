import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import { EstadoOrdenCompra, TipoMaterial } from './../src/domain';
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

describe('CU14 Gestion de Ordenes de Compra (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let authHeaders: { Authorization: string };
  let proveedorPruebaId: number;
  let materialPruebaId: number;
  let ordenCompraCreadaId: number | undefined;

  const timestamp = Date.now();
  const nombreProveedorPrueba = `Proveedor e2e-cu14 ${timestamp}`;
  const correoProveedorPrueba = `proveedor-e2e-cu14-${timestamp}@example.com`;
  const nombreMaterialPrueba = `Material e2e-cu14 ${timestamp}`;

  const cleanupTestData = async () => {
    const proveedoresPrueba = await prismaService.proveedor.findMany({
      where: {
        OR: [
          {
            nombre: {
              contains: 'e2e-cu14',
            },
          },
          {
            correo: {
              contains: 'e2e-cu14',
            },
          },
        ],
      },
      select: {
        idProveedor: true,
      },
    });

    const proveedoresIds = proveedoresPrueba.map(
      (proveedor) => proveedor.idProveedor,
    );

    const materialesPrueba = await prismaService.material.findMany({
      where: {
        nombre: {
          contains: 'e2e-cu14',
        },
      },
      select: {
        idMaterial: true,
      },
    });

    const materialesIds = materialesPrueba.map(
      (material) => material.idMaterial,
    );

    const ordenesPrueba =
      proveedoresIds.length > 0
        ? await prismaService.ordenCompra.findMany({
            where: {
              idProveedor: {
                in: proveedoresIds,
              },
            },
            select: {
              idOrdenCompra: true,
            },
          })
        : [];

    const ordenesIds = ordenesPrueba.map((orden) => orden.idOrdenCompra);

    if (ordenesIds.length > 0 || materialesIds.length > 0) {
      const condiciones: Array<Record<string, unknown>> = [];

      if (ordenesIds.length > 0) {
        condiciones.push({
          idOrdenCompra: {
            in: ordenesIds,
          },
        });
      }

      if (materialesIds.length > 0) {
        condiciones.push({
          idMaterial: {
            in: materialesIds,
          },
        });
      }

      await prismaService.lineaOrdenCompra.deleteMany({
        where: {
          OR: condiciones,
        },
      });
    }

    if (ordenesIds.length > 0) {
      await prismaService.ordenCompra.deleteMany({
        where: {
          idOrdenCompra: {
            in: ordenesIds,
          },
        },
      });
    }

    if (materialesIds.length > 0) {
      await prismaService.material.deleteMany({
        where: {
          idMaterial: {
            in: materialesIds,
          },
        },
      });
    }

    if (proveedoresIds.length > 0) {
      await prismaService.proveedor.deleteMany({
        where: {
          idProveedor: {
            in: proveedoresIds,
          },
        },
      });
    }
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
      'e2e-cu14-auth',
    );
    await cleanupTestData();

    const proveedorPrueba = await prismaService.proveedor.create({
      data: {
        nombre: nombreProveedorPrueba,
        direccion: 'Av. Proveedor 123',
        telefono: '76545555',
        correo: correoProveedorPrueba,
        terminosEntrega: '48 horas',
      },
    });

    proveedorPruebaId = proveedorPrueba.idProveedor;

    const materialPrueba = await prismaService.material.create({
      data: {
        nombre: nombreMaterialPrueba,
        descripcion: 'Material de prueba E2E CU14',
        tipoMaterial: TipoMaterial.GENERAL,
        unidad: 'caja',
        cantidadDisponible: 100,
        costoUnitario: 22.5,
        especificacionesTecnicas: 'Specs CU14',
      },
    });

    materialPruebaId = materialPrueba.idMaterial;
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo principal de CU14', async () => {
    const api = createAuthorizedRequest(app, authHeaders);
    const createResponse = await api
      .post('/cu14/ordenes-compra')
      .send({
        idProveedor: proveedorPruebaId,
        fechaOrden: '2026-06-01T00:00:00.000Z',
        fechaEntregaEstimada: '2026-06-10T00:00:00.000Z',
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idOrdenCompra: expectAnyNumber(),
        idProveedor: proveedorPruebaId,
        estadoOrden: EstadoOrdenCompra.BORRADOR,
      }),
    });

    const createResponseBody = getSuccessBody<{ idOrdenCompra: number }>(
      createResponse,
    );

    ordenCompraCreadaId = createResponseBody.data.idOrdenCompra;

    await api
      .post('/cu14/ordenes-compra')
      .send({
        idProveedor: 999999,
        fechaOrden: '2026-06-01T00:00:00.000Z',
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu14/ordenes-compra',
          message: 'No se encontro el proveedor con id 999999.',
          errors: [],
        });
      });

    await api
      .post('/cu14/ordenes-compra')
      .send({
        idProveedor: proveedorPruebaId,
        fechaOrden: '2026-06-10T00:00:00.000Z',
        fechaEntregaEstimada: '2026-06-01T00:00:00.000Z',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: '/cu14/ordenes-compra',
          message:
            'La fecha de entrega estimada no puede ser anterior a la fecha de la orden.',
          errors: [],
        });
      });

    await api
      .post(`/cu14/ordenes-compra/${ordenCompraCreadaId}/lineas`)
      .send({
        idMaterial: materialPruebaId,
        cantidadSolicitada: 8,
        precioUnitarioAcordado: 15.5,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idLineaOrdenCompra: expectAnyNumber(),
            idOrdenCompra: ordenCompraCreadaId,
            idMaterial: materialPruebaId,
            cantidadSolicitada: 8,
            precioUnitarioAcordado: 15.5,
            estadoLinea: 'PENDIENTE',
          }),
        });
      });

    await api
      .post(`/cu14/ordenes-compra/${ordenCompraCreadaId}/lineas`)
      .send({
        idMaterial: 999999,
        cantidadSolicitada: 5,
        precioUnitarioAcordado: 10,
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: `/cu14/ordenes-compra/${ordenCompraCreadaId}/lineas`,
          message: 'No se encontro el material con id 999999.',
          errors: [],
        });
      });

    await api
      .get('/cu14/ordenes-compra')
      .query({
        idProveedor: proveedorPruebaId,
        estadoOrden: EstadoOrdenCompra.BORRADOR,
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<Array<{ idOrdenCompra: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (orden: { idOrdenCompra: number }) =>
              orden.idOrdenCompra === ordenCompraCreadaId,
          ),
        ).toBe(true);
      });

    await api
      .get(`/cu14/ordenes-compra/${ordenCompraCreadaId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idOrdenCompra: ordenCompraCreadaId,
            idProveedor: proveedorPruebaId,
            estadoOrden: EstadoOrdenCompra.BORRADOR,
          }),
        });
      });

    await api
      .patch(`/cu14/ordenes-compra/${ordenCompraCreadaId}`)
      .send({
        fechaEntregaEstimada: '2026-06-12T00:00:00.000Z',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idOrdenCompra: ordenCompraCreadaId,
            fechaEntregaEstimada: '2026-06-12T00:00:00.000Z',
          }),
        });
      });

    await api
      .patch(`/cu14/ordenes-compra/${ordenCompraCreadaId}/estado`)
      .send({
        estadoOrden: EstadoOrdenCompra.EMITIDA,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idOrdenCompra: ordenCompraCreadaId,
            estadoOrden: EstadoOrdenCompra.EMITIDA,
          }),
        });
      });

    await api
      .get(`/cu14/ordenes-compra/${ordenCompraCreadaId}/monto-total`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            idOrdenCompra: ordenCompraCreadaId,
            montoTotal: 124,
          },
        });
      });
  });
});
