import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import { EstadoProyecto, TipoMaterial } from './../src/domain';
import { PrismaService } from './../src/infrastructure';
import {
  expectAnyNumber,
  expectAnyString,
  expectObjectContaining,
  getSuccessBody,
} from './helpers/e2e-response.types';

describe('CU17 Pronostico de Necesidades de Materiales mediante IA (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let clientePruebaId: number;
  let proyectoPruebaId: number;
  let materialPruebaId: number;
  let pronosticoCreadoId: number | undefined;

  const timestamp = Date.now();
  const correoClientePrueba = `cliente-e2e-cu17-${timestamp}@example.com`;
  const nombreProyectoPrueba = `Proyecto e2e-cu17 ${timestamp}`;
  const nombreMaterialPrueba = `Material e2e-cu17 ${timestamp}`;

  const cleanupTestData = async () => {
    const clientesPrueba = await prismaService.cliente.findMany({
      where: {
        correo: {
          contains: 'e2e-cu17',
        },
      },
      select: {
        idCliente: true,
      },
    });

    const clientesIds = clientesPrueba.map((cliente) => cliente.idCliente);

    const materialesPrueba = await prismaService.material.findMany({
      where: {
        nombre: {
          contains: 'e2e-cu17',
        },
      },
      select: {
        idMaterial: true,
      },
    });

    const materialesIds = materialesPrueba.map(
      (material) => material.idMaterial,
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

    if (proyectosIds.length > 0 || materialesIds.length > 0) {
      const condiciones: Array<Record<string, unknown>> = [];

      if (proyectosIds.length > 0) {
        condiciones.push({
          idProyecto: {
            in: proyectosIds,
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

      await prismaService.pronosticoMaterial.deleteMany({
        where: {
          OR: condiciones,
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

    if (materialesIds.length > 0) {
      await prismaService.material.deleteMany({
        where: {
          idMaterial: {
            in: materialesIds,
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
    await cleanupTestData();

    const clientePrueba = await prismaService.cliente.create({
      data: {
        nombre: 'Cliente E2E CU17',
        direccion: 'Av. Pronosticos 1700',
        telefono: `72${timestamp.toString().slice(-6)}`,
        correo: correoClientePrueba,
        tipoCliente: 'EMPRESA',
      },
    });

    clientePruebaId = clientePrueba.idCliente;

    const proyectoPrueba = await prismaService.proyecto.create({
      data: {
        idCliente: clientePruebaId,
        nombre: nombreProyectoPrueba,
        descripcion: 'Proyecto de prueba E2E CU17',
        ubicacion: 'Tarija',
        presupuesto: 310000,
        fechaInicio: new Date('2026-11-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2027-02-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs CU17',
      },
    });

    proyectoPruebaId = proyectoPrueba.idProyecto;

    const materialPrueba = await prismaService.material.create({
      data: {
        nombre: nombreMaterialPrueba,
        descripcion: 'Material de prueba E2E CU17',
        tipoMaterial: TipoMaterial.GENERAL,
        unidad: 'unidad',
        cantidadDisponible: 15,
        costoUnitario: 11,
        especificacionesTecnicas: 'Specs material CU17',
      },
    });

    materialPruebaId = materialPrueba.idMaterial;
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo principal de CU17', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/cu17/pronostico-materiales-ia')
      .send({
        idProyecto: proyectoPruebaId,
        idMaterial: materialPruebaId,
        periodoAnalisis: '2026-Q4',
        stockMinimo: 10,
        stockMaximo: 20,
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idPronosticoMaterial: expectAnyNumber(),
        idProyecto: proyectoPruebaId,
        idMaterial: materialPruebaId,
        periodoAnalisis: '2026-Q4',
        stockMinimo: 10,
        stockMaximo: 20,
        nivelConfianza: 85,
      }),
    });

    const createResponseBody = getSuccessBody<{ idPronosticoMaterial: number }>(
      createResponse,
    );

    pronosticoCreadoId = createResponseBody.data.idPronosticoMaterial;

    await request(app.getHttpServer())
      .post('/cu17/pronostico-materiales-ia')
      .send({
        idProyecto: 999999,
        periodoAnalisis: '2026-Q4',
        stockMinimo: 10,
        stockMaximo: 20,
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu17/pronostico-materiales-ia',
          message: 'No se encontro el proyecto con id 999999.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .post('/cu17/pronostico-materiales-ia')
      .send({
        idProyecto: proyectoPruebaId,
        idMaterial: 999999,
        periodoAnalisis: '2026-Q4',
        stockMinimo: 10,
        stockMaximo: 20,
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu17/pronostico-materiales-ia',
          message: 'No se encontro el material con id 999999.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .post('/cu17/pronostico-materiales-ia')
      .send({
        idProyecto: proyectoPruebaId,
        idMaterial: materialPruebaId,
        periodoAnalisis: '2026-Q4',
        stockMinimo: 30,
        stockMaximo: 20,
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: '/cu17/pronostico-materiales-ia',
          message: 'El stock máximo no puede ser menor que el stock mínimo.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .get('/cu17/pronostico-materiales-ia')
      .query({
        idProyecto: proyectoPruebaId,
        idMaterial: materialPruebaId,
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body =
          getSuccessBody<Array<{ idPronosticoMaterial: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (pronostico: { idPronosticoMaterial: number }) =>
              pronostico.idPronosticoMaterial === pronosticoCreadoId,
          ),
        ).toBe(true);
      });

    await request(app.getHttpServer())
      .patch(`/cu17/pronostico-materiales-ia/${pronosticoCreadoId}/ajustar`)
      .send({
        stockMinimo: 8,
        stockMaximo: 18,
        observaciones: 'Ajuste operativo',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idPronosticoMaterial: pronosticoCreadoId,
            stockMinimo: 8,
            stockMaximo: 18,
            observaciones: 'Ajuste operativo',
            nivelConfianza: 80,
          }),
        });
      });

    await request(app.getHttpServer())
      .get(`/cu17/pronostico-materiales-ia/${pronosticoCreadoId}/confianza`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            idPronosticoMaterial: pronosticoCreadoId,
            nivelConfianza: 85,
            mensaje: 'Nivel de confianza calculado con heurística provisional.',
          },
        });
      });

    await request(app.getHttpServer())
      .patch(`/cu17/pronostico-materiales-ia/${pronosticoCreadoId}/confirmar`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idPronosticoMaterial: pronosticoCreadoId,
            observaciones:
              'Ajuste operativo Pronóstico confirmado para planificación de compras.',
          }),
        });
      });
  });
});
