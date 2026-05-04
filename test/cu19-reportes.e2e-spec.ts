import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import { EstadoProyecto, TipoReporte } from './../src/domain';
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
import * as fs from 'fs';
import * as path from 'path';

describe('CU19 Generacion y Consulta de Reportes (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let authHeaders: { Authorization: string };
  let clientePruebaId: number;
  let proyectoPruebaId: number;
  let reporteProyectoId: number | undefined;

  const timestamp = Date.now();
  const correoClientePrueba = `cliente-e2e-cu19-${timestamp}@example.com`;
  const nombreProyectoPrueba = `Proyecto e2e-cu19 ${timestamp}`;
  const periodoGeneralInicio = new Date(timestamp + 1000);
  const periodoGeneralFin = new Date(timestamp + 2000);
  const periodoProyectoInicio = new Date(timestamp + 3000);
  const periodoProyectoFin = new Date(timestamp + 4000);

  const cleanupTestData = async () => {
    const clientesPrueba = await prismaService.cliente.findMany({
      where: {
        correo: {
          contains: 'e2e-cu19',
        },
      },
      select: {
        idCliente: true,
      },
    });

    const clientesIds = clientesPrueba.map((cliente) => cliente.idCliente);

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

    const reportesPrueba = await prismaService.reporte.findMany({
      where: {
        OR: [
          proyectosIds.length > 0
            ? {
                idProyecto: {
                  in: proyectosIds,
                },
              }
            : {
                idReporte: -1,
              },
          {
            fechaInicioPeriodo: {
              in: [periodoGeneralInicio, periodoProyectoInicio],
            },
          },
          {
            fechaFinPeriodo: {
              in: [periodoGeneralFin, periodoProyectoFin],
            },
          },
        ],
      },
      select: {
        idReporte: true,
      },
    });

    const reportesIds = reportesPrueba.map((reporte) => reporte.idReporte);

    if (reportesIds.length > 0) {
      await prismaService.reporte.deleteMany({
        where: {
          idReporte: {
            in: reportesIds,
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
      'e2e-cu19-auth',
    );
    await cleanupTestData();

    const clientePrueba = await prismaService.cliente.create({
      data: {
        nombre: 'Cliente E2E CU19',
        direccion: 'Av. Reportes 1900',
        telefono: `70${timestamp.toString().slice(-6)}`,
        correo: correoClientePrueba,
        tipoCliente: 'EMPRESA',
      },
    });

    clientePruebaId = clientePrueba.idCliente;

    const proyectoPrueba = await prismaService.proyecto.create({
      data: {
        idCliente: clientePruebaId,
        nombre: nombreProyectoPrueba,
        descripcion: 'Proyecto de prueba E2E CU19',
        ubicacion: 'Cochabamba',
        presupuesto: 450000,
        fechaInicio: new Date('2027-03-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2027-07-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs CU19',
      },
    });

    proyectoPruebaId = proyectoPrueba.idProyecto;
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo principal de CU19', async () => {
    const api = createAuthorizedRequest(app, authHeaders);
    const generalResponse = await api
      .post('/cu19/reportes')
      .send({
        tipoReporte: TipoReporte.GENERAL,
        fechaInicioPeriodo: periodoGeneralInicio.toISOString(),
        fechaFinPeriodo: periodoGeneralFin.toISOString(),
      })
      .expect(201);

    expect(generalResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idReporte: expectAnyNumber(),
        tipoReporte: TipoReporte.GENERAL,
        contenidoResumen: 'Reporte general provisional del sistema.',
      }),
    });

    const proyectoResponse = await api
      .post('/cu19/reportes')
      .send({
        idProyecto: proyectoPruebaId,
        tipoReporte: TipoReporte.AVANCE_PROYECTO,
        fechaInicioPeriodo: periodoProyectoInicio.toISOString(),
        fechaFinPeriodo: periodoProyectoFin.toISOString(),
      })
      .expect(201);

    expect(proyectoResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idReporte: expectAnyNumber(),
        idProyecto: proyectoPruebaId,
        tipoReporte: TipoReporte.AVANCE_PROYECTO,
        porcentajeAvanceGeneral: 0,
        contenidoResumen: 'Reporte provisional de avance del proyecto.',
      }),
    });

    const proyectoResponseBody = getSuccessBody<{ idReporte: number }>(
      proyectoResponse,
    );

    reporteProyectoId = proyectoResponseBody.data.idReporte;

    await api
      .post('/cu19/reportes')
      .send({
        idProyecto: 999999,
        tipoReporte: TipoReporte.GENERAL,
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu19/reportes',
          message: 'No se encontro el proyecto con id 999999.',
          errors: [],
        });
      });

    await api
      .post('/cu19/reportes')
      .send({
        tipoReporte: TipoReporte.COSTOS,
        fechaInicioPeriodo: '2027-03-10T00:00:00.000Z',
        fechaFinPeriodo: '2027-03-01T00:00:00.000Z',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: '/cu19/reportes',
          message:
            'La fecha fin del periodo no puede ser anterior a la fecha inicio del periodo.',
          errors: [],
        });
      });

    await api
      .get('/cu19/reportes')
      .query({
        idProyecto: proyectoPruebaId,
        tipoReporte: TipoReporte.AVANCE_PROYECTO,
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<Array<{ idReporte: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (reporte: { idReporte: number }) =>
              reporte.idReporte === reporteProyectoId,
          ),
        ).toBe(true);
      });

    await api
      .get(`/cu19/reportes/${reporteProyectoId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idReporte: reporteProyectoId,
            idProyecto: proyectoPruebaId,
            tipoReporte: TipoReporte.AVANCE_PROYECTO,
          }),
        });
      });

    let pdfPath = '';

    await api
      .patch(`/cu19/reportes/${reporteProyectoId}/exportar-pdf`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            idReporte: reporteProyectoId,
            exportado: true,
            rutaArchivoPdf: expectAnyString(),
            generadoFisicamente: true,
            mensaje: 'Reporte PDF generado correctamente.',
          },
        });
        pdfPath = String(
          (body as { data: { rutaArchivoPdf: string } }).data.rutaArchivoPdf,
        );
      });

    const reporteActualizado = await prismaService.reporte.findUnique({
      where: {
        idReporte: reporteProyectoId,
      },
    });

    expect(reporteActualizado?.rutaArchivoPdf).toBe(pdfPath);
    expect(
      fs.existsSync(
        path.resolve(
          process.env.REPORTS_DIR || 'reports',
          path.basename(pdfPath),
        ),
      ),
    ).toBe(true);

    await api
      .patch('/cu19/reportes/999999/exportar-pdf')
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu19/reportes/999999/exportar-pdf',
          message: 'No se encontro el reporte con id 999999.',
          errors: [],
        });
      });
  });
});
