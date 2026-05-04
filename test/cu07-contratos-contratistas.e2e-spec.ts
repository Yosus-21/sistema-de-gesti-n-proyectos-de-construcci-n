import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import { EstadoProyecto } from './../src/domain';
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

describe('CU07 Gestion de Contrato con Contratista (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let authHeaders: { Authorization: string };
  let clientePruebaId: number;
  let proyectoPruebaId: number;
  let contratistaPruebaId: number;
  let contratoCreadoId: number | undefined;

  const timestamp = Date.now();
  const correoClientePrueba = `cliente-e2e-cu07-${timestamp}@example.com`;
  const correoContratistaPrueba = `contratista-e2e-cu07-${timestamp}@example.com`;
  const ciContratistaPrueba = `E2E-CU07-${timestamp}`;

  const cleanupTestData = async () => {
    const clientesPrueba = await prismaService.cliente.findMany({
      where: {
        correo: {
          contains: 'e2e-cu07',
        },
      },
      select: {
        idCliente: true,
      },
    });

    const clientesIds = clientesPrueba.map((cliente) => cliente.idCliente);

    const contratistasPrueba = await prismaService.contratista.findMany({
      where: {
        OR: [
          {
            correo: {
              contains: 'e2e-cu07',
            },
          },
          {
            ci: {
              contains: 'E2E-CU07',
            },
          },
        ],
      },
      select: {
        idContratista: true,
      },
    });

    const contratistasIds = contratistasPrueba.map(
      (contratista) => contratista.idContratista,
    );

    const proyectosPrueba =
      clientesIds.length > 0
        ? await prismaService.proyecto.findMany({
            where: {
              idCliente: {
                in: clientesIds,
              },
            },
            select: {
              idProyecto: true,
            },
          })
        : [];

    const proyectosIds = proyectosPrueba.map((proyecto) => proyecto.idProyecto);

    const contratosIds =
      proyectosIds.length > 0 || contratistasIds.length > 0
        ? (
            await prismaService.contrato.findMany({
              where: {
                OR: [
                  ...(proyectosIds.length > 0
                    ? [
                        {
                          idProyecto: {
                            in: proyectosIds,
                          },
                        },
                      ]
                    : []),
                  ...(contratistasIds.length > 0
                    ? [
                        {
                          idContratista: {
                            in: contratistasIds,
                          },
                        },
                      ]
                    : []),
                ],
              },
              select: {
                idContrato: true,
              },
            })
          ).map((contrato) => contrato.idContrato)
        : [];

    if (contratosIds.length > 0) {
      await prismaService.contratoDetalle.deleteMany({
        where: {
          idContrato: {
            in: contratosIds,
          },
        },
      });

      await prismaService.contrato.deleteMany({
        where: {
          idContrato: {
            in: contratosIds,
          },
        },
      });
    }

    if (proyectosIds.length > 0) {
      await prismaService.proyecto.deleteMany({
        where: {
          idProyecto: {
            in: proyectosIds,
          },
        },
      });
    }

    if (clientesIds.length > 0) {
      await prismaService.cliente.deleteMany({
        where: {
          idCliente: {
            in: clientesIds,
          },
        },
      });
    }

    if (contratistasIds.length > 0) {
      await prismaService.contratista.deleteMany({
        where: {
          idContratista: {
            in: contratistasIds,
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
      'e2e-cu07-auth',
    );
    await cleanupTestData();

    const clientePrueba = await prismaService.cliente.create({
      data: {
        nombre: 'Cliente E2E CU07',
        direccion: 'Av. Contratos 123',
        telefono: `76${timestamp.toString().slice(-6)}`,
        correo: correoClientePrueba,
        tipoCliente: 'EMPRESA',
      },
    });

    clientePruebaId = clientePrueba.idCliente;

    const proyectoPrueba = await prismaService.proyecto.create({
      data: {
        idCliente: clientePruebaId,
        nombre: `Proyecto e2e-cu07 ${timestamp}`,
        descripcion: 'Proyecto de prueba E2E CU07',
        ubicacion: 'La Paz',
        presupuesto: 500000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-09-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Especificaciones tecnicas E2E CU07',
      },
    });

    proyectoPruebaId = proyectoPrueba.idProyecto;

    const contratistaPrueba = await prismaService.contratista.create({
      data: {
        nombre: 'Contratista E2E CU07',
        ci: ciContratistaPrueba,
        empresa: 'Constructora E2E CU07',
        telefono: '70000077',
        correo: correoContratistaPrueba,
      },
    });

    contratistaPruebaId = contratistaPrueba.idContratista;
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo principal de CU07', async () => {
    const api = createAuthorizedRequest(app, authHeaders);
    const createResponse = await api
      .post('/cu07/contratos-contratistas')
      .send({
        idProyecto: proyectoPruebaId,
        idContratista: contratistaPruebaId,
        fechaInicio: '2026-05-01T00:00:00.000Z',
        fechaFin: '2026-05-06T00:00:00.000Z',
        metodoPago: 'Transferencia',
        terminosYCondiciones: 'Pago semanal',
        detalles: [
          {
            cantidadPersonas: 2,
            costoUnitarioPorDia: 100,
          },
          {
            cantidadPersonas: 1,
            costoUnitarioPorDia: 50,
          },
        ],
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idContrato: expectAnyNumber(),
        idProyecto: proyectoPruebaId,
        idContratista: contratistaPruebaId,
        metodoPago: 'Transferencia',
        terminosYCondiciones: 'Pago semanal',
        estadoContrato: 'VIGENTE',
        costoTotal: 1250,
      }),
    });

    const createResponseBody = getSuccessBody<{ idContrato: number }>(
      createResponse,
    );

    contratoCreadoId = createResponseBody.data.idContrato;

    await api
      .post('/cu07/contratos-contratistas')
      .send({
        idProyecto: 999999,
        idContratista: contratistaPruebaId,
        fechaInicio: '2026-05-01T00:00:00.000Z',
        fechaFin: '2026-05-06T00:00:00.000Z',
        metodoPago: 'Transferencia',
        terminosYCondiciones: 'Pago semanal',
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu07/contratos-contratistas',
          message: 'No se encontro el proyecto con id 999999.',
          errors: [],
        });
      });

    await api
      .post('/cu07/contratos-contratistas')
      .send({
        idProyecto: proyectoPruebaId,
        idContratista: 999999,
        fechaInicio: '2026-05-01T00:00:00.000Z',
        fechaFin: '2026-05-06T00:00:00.000Z',
        metodoPago: 'Transferencia',
        terminosYCondiciones: 'Pago semanal',
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu07/contratos-contratistas',
          message: 'No se encontro el contratista con id 999999.',
          errors: [],
        });
      });

    await api
      .post('/cu07/contratos-contratistas')
      .send({
        idProyecto: proyectoPruebaId,
        idContratista: contratistaPruebaId,
        fechaInicio: '2026-05-06T00:00:00.000Z',
        fechaFin: '2026-05-01T00:00:00.000Z',
        metodoPago: 'Transferencia',
        terminosYCondiciones: 'Pago semanal',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: '/cu07/contratos-contratistas',
          message:
            'La fecha de fin no puede ser anterior a la fecha de inicio.',
          errors: [],
        });
      });

    await api
      .get('/cu07/contratos-contratistas')
      .query({
        idProyecto: proyectoPruebaId,
        idContratista: contratistaPruebaId,
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<Array<{ idContrato: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (contrato: { idContrato: number }) =>
              contrato.idContrato === contratoCreadoId,
          ),
        ).toBe(true);
      });

    await api
      .get(`/cu07/contratos-contratistas/${contratoCreadoId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idContrato: contratoCreadoId,
            idProyecto: proyectoPruebaId,
            idContratista: contratistaPruebaId,
            estadoContrato: 'VIGENTE',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            detalles: expect.arrayContaining([
              expectObjectContaining({
                cantidadPersonas: 2,
                costoUnitarioPorDia: 100,
              }),
              expectObjectContaining({
                cantidadPersonas: 1,
                costoUnitarioPorDia: 50,
              }),
            ]),
          }),
        });
      });

    await api
      .patch(`/cu07/contratos-contratistas/${contratoCreadoId}`)
      .send({
        metodoPago: 'Cheque',
        terminosYCondiciones: 'Pago quincenal',
        fechaFin: '2026-05-08T00:00:00.000Z',
        detalles: [
          {
            cantidadPersonas: 3,
            costoUnitarioPorDia: 100,
          },
        ],
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idContrato: contratoCreadoId,
            metodoPago: 'Cheque',
            terminosYCondiciones: 'Pago quincenal',
            costoTotal: 2100, // 7 days * (3 * 100) = 2100
          }),
        });
      });

    await api
      .get(`/cu07/contratos-contratistas/${contratoCreadoId}/costo`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            idContrato: contratoCreadoId,
            costoTotal: 2100,
          },
        });
      });

    await api
      .get(`/cu07/contratos-contratistas/${contratoCreadoId}/vigencia`)
      .query({
        fechaReferencia: '2026-05-03',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            idContrato: contratoCreadoId,
            vigente: true,
            fechaReferencia: '2026-05-03T00:00:00.000Z',
          },
        });
      });
  });
});
