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

describe('CU15 Gestion de Entrega de Materiales (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let authHeaders: { Authorization: string };
  let proveedorPruebaId: number;
  let materialPruebaId: number;
  let materialPruebaBId: number;
  let materialFueraOrdenId: number;
  let ordenCompraPruebaId: number;
  let entregaCreadaId: number | undefined;
  let entregaMaterialBId: number | undefined;

  const timestamp = Date.now();
  const nombreProveedorPrueba = `Proveedor e2e-cu15 ${timestamp}`;
  const correoProveedorPrueba = `proveedor-e2e-cu15-${timestamp}@example.com`;
  const nombreMaterialPrueba = `Material e2e-cu15 ${timestamp}`;
  const nombreMaterialPruebaB = `Material B e2e-cu15 ${timestamp}`;
  const nombreMaterialFueraOrden = `Material fuera orden e2e-cu15 ${timestamp}`;

  const cleanupTestData = async () => {
    const proveedoresPrueba = await prismaService.proveedor.findMany({
      where: {
        OR: [
          {
            nombre: {
              contains: 'e2e-cu15',
            },
          },
          {
            correo: {
              contains: 'e2e-cu15',
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
          contains: 'e2e-cu15',
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

      await prismaService.entregaMaterial.deleteMany({
        where: {
          OR: condiciones,
        },
      });

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
      'e2e-cu15-auth',
    );
    await cleanupTestData();

    const proveedorPrueba = await prismaService.proveedor.create({
      data: {
        nombre: nombreProveedorPrueba,
        direccion: 'Av. Proveedor 123',
        telefono: '76546666',
        correo: correoProveedorPrueba,
        terminosEntrega: '48 horas',
      },
    });

    proveedorPruebaId = proveedorPrueba.idProveedor;

    const materialPrueba = await prismaService.material.create({
      data: {
        nombre: nombreMaterialPrueba,
        descripcion: 'Material de prueba E2E CU15',
        tipoMaterial: TipoMaterial.GENERAL,
        unidad: 'caja',
        cantidadDisponible: 10,
        costoUnitario: 18,
        especificacionesTecnicas: 'Specs CU15',
      },
    });

    materialPruebaId = materialPrueba.idMaterial;

    const materialPruebaB = await prismaService.material.create({
      data: {
        nombre: nombreMaterialPruebaB,
        descripcion: 'Segundo material de prueba E2E CU15',
        tipoMaterial: TipoMaterial.GENERAL,
        unidad: 'bolsa',
        cantidadDisponible: 2,
        costoUnitario: 22,
        especificacionesTecnicas: 'Specs CU15 B',
      },
    });

    materialPruebaBId = materialPruebaB.idMaterial;

    const materialFueraOrden = await prismaService.material.create({
      data: {
        nombre: nombreMaterialFueraOrden,
        descripcion: 'Material fuera de la orden',
        tipoMaterial: TipoMaterial.GENERAL,
        unidad: 'caja',
        cantidadDisponible: 3,
        costoUnitario: 12,
      },
    });

    materialFueraOrdenId = materialFueraOrden.idMaterial;

    const ordenCompraPrueba = await prismaService.ordenCompra.create({
      data: {
        idProveedor: proveedorPruebaId,
        fechaOrden: new Date('2026-06-10T00:00:00.000Z'),
        fechaEntregaEstimada: new Date('2026-06-20T00:00:00.000Z'),
        estadoOrden: EstadoOrdenCompra.EMITIDA,
      },
    });

    ordenCompraPruebaId = ordenCompraPrueba.idOrdenCompra;

    await prismaService.lineaOrdenCompra.create({
      data: {
        idOrdenCompra: ordenCompraPruebaId,
        idMaterial: materialPruebaId,
        cantidadSolicitada: 5,
        precioUnitarioAcordado: 15,
        estadoLinea: 'PENDIENTE',
      },
    });

    await prismaService.lineaOrdenCompra.create({
      data: {
        idOrdenCompra: ordenCompraPruebaId,
        idMaterial: materialPruebaBId,
        cantidadSolicitada: 3,
        precioUnitarioAcordado: 22,
        estadoLinea: 'PENDIENTE',
      },
    });
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo principal de CU15', async () => {
    const api = createAuthorizedRequest(app, authHeaders);
    const createResponse = await api
      .post('/cu15/entregas-materiales')
      .send({
        idOrdenCompra: ordenCompraPruebaId,
        idMaterial: materialPruebaId,
        fechaEntrega: '2026-06-15T00:00:00.000Z',
        cantidadEntregada: 5,
        observaciones: 'Entrega completa',
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idEntregaMaterial: expectAnyNumber(),
        idOrdenCompra: ordenCompraPruebaId,
        idMaterial: materialPruebaId,
        cantidadEntregada: 5,
        estadoEntrega: 'REGISTRADA',
      }),
    });

    const createResponseBody = getSuccessBody<{ idEntregaMaterial: number }>(
      createResponse,
    );

    entregaCreadaId = createResponseBody.data.idEntregaMaterial;

    await api
      .post('/cu15/entregas-materiales')
      .send({
        idOrdenCompra: 999999,
        idMaterial: materialPruebaId,
        fechaEntrega: '2026-06-15T00:00:00.000Z',
        cantidadEntregada: 2,
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu15/entregas-materiales',
          message: 'No se encontro la orden de compra con id 999999.',
          errors: [],
        });
      });

    await api
      .post('/cu15/entregas-materiales')
      .send({
        idOrdenCompra: ordenCompraPruebaId,
        idMaterial: 999999,
        fechaEntrega: '2026-06-15T00:00:00.000Z',
        cantidadEntregada: 2,
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu15/entregas-materiales',
          message: 'No se encontro el material con id 999999.',
          errors: [],
        });
      });

    await api
      .post('/cu15/entregas-materiales')
      .send({
        idOrdenCompra: ordenCompraPruebaId,
        idMaterial: materialFueraOrdenId,
        fechaEntrega: '2026-06-15T00:00:00.000Z',
        cantidadEntregada: 1,
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: '/cu15/entregas-materiales',
          message: 'El material entregado no pertenece a la orden de compra.',
          errors: [],
        });
      });

    await api
      .post('/cu15/entregas-materiales')
      .send({
        idOrdenCompra: ordenCompraPruebaId,
        idMaterial: materialPruebaId,
        fechaEntrega: '2026-06-15T00:00:00.000Z',
        cantidadEntregada: 10,
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: '/cu15/entregas-materiales',
          message:
            'La cantidad entregada no puede superar la cantidad solicitada en la orden de compra.',
          errors: [],
        });
      });

    await api
      .get('/cu15/entregas-materiales')
      .query({
        idOrdenCompra: ordenCompraPruebaId,
        idMaterial: materialPruebaId,
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body =
          getSuccessBody<Array<{ idEntregaMaterial: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (entrega: { idEntregaMaterial: number }) =>
              entrega.idEntregaMaterial === entregaCreadaId,
          ),
        ).toBe(true);
      });

    await api
      .get(`/cu15/entregas-materiales/${entregaCreadaId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idEntregaMaterial: entregaCreadaId,
            idOrdenCompra: ordenCompraPruebaId,
            idMaterial: materialPruebaId,
            estadoEntrega: 'REGISTRADA',
          }),
        });
      });

    await api
      .get(
        `/cu15/entregas-materiales/${entregaCreadaId}/verificar-contra-orden/${ordenCompraPruebaId}`,
      )
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            idEntregaMaterial: entregaCreadaId,
            idOrdenCompra: ordenCompraPruebaId,
            coincide: true,
            cantidadEntregada: 5,
            cantidadSolicitada: 5,
            mensaje: 'La entrega coincide con la orden de compra.',
          },
        });
      });

    await api
      .patch(`/cu15/entregas-materiales/${entregaCreadaId}/confirmar-recepcion`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idEntregaMaterial: entregaCreadaId,
            estadoEntrega: 'RECIBIDA',
          }),
        });
      });

    const materialActualizado = await prismaService.material.findUnique({
      where: {
        idMaterial: materialPruebaId,
      },
    });

    expect(materialActualizado?.cantidadDisponible).toBe(15);

    await api
      .get(`/cu14/ordenes-compra/${ordenCompraPruebaId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idOrdenCompra: ordenCompraPruebaId,
            estadoOrden: EstadoOrdenCompra.EMITIDA,
          }),
        });
      });

    const entregaMaterialBResponse = await api
      .post('/cu15/entregas-materiales')
      .send({
        idOrdenCompra: ordenCompraPruebaId,
        idMaterial: materialPruebaBId,
        fechaEntrega: '2026-06-16T00:00:00.000Z',
        cantidadEntregada: 3,
        observaciones: 'Entrega completa material B',
      })
      .expect(201);

    entregaMaterialBId = getSuccessBody<{ idEntregaMaterial: number }>(
      entregaMaterialBResponse,
    ).data.idEntregaMaterial;

    await api
      .patch(
        `/cu15/entregas-materiales/${entregaMaterialBId}/confirmar-recepcion`,
      )
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idEntregaMaterial: entregaMaterialBId,
            estadoEntrega: 'RECIBIDA',
          }),
        });
      });

    const materialBActualizado = await prismaService.material.findUnique({
      where: {
        idMaterial: materialPruebaBId,
      },
    });

    expect(materialBActualizado?.cantidadDisponible).toBe(5);

    await api
      .get(`/cu14/ordenes-compra/${ordenCompraPruebaId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idOrdenCompra: ordenCompraPruebaId,
            estadoOrden: EstadoOrdenCompra.RECIBIDA,
          }),
        });
      });

    await api
      .patch(`/cu15/entregas-materiales/${entregaCreadaId}/confirmar-recepcion`)
      .expect(409)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 409,
          timestamp: expectAnyString(),
          path: `/cu15/entregas-materiales/${entregaCreadaId}/confirmar-recepcion`,
          message: 'La entrega de material ya fue confirmada como recibida.',
          errors: [],
        });
      });
  });
});
