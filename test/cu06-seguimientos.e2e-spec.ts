import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import {
  EstadoCronograma,
  EstadoProyecto,
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
  TipoTarea,
} from './../src/domain';
import { PrismaService } from './../src/infrastructure';
import {
  expectAnyNumber,
  expectAnyString,
  expectObjectContaining,
  getSuccessBody,
  getErrorBody,
} from './helpers/e2e-response.types';

describe('CU06 Gestion de Seguimiento (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let clientePruebaId: number;
  let proyectoPruebaId: number;
  let cronogramaPruebaId: number;
  let tareaPruebaId: number;
  let seguimientoCreadoId: number | undefined;

  const timestamp = Date.now();
  const correoClientePrueba = `cliente-e2e-cu06-${timestamp}@example.com`;
  const nombreProyectoPrueba = `Proyecto e2e-cu06 ${timestamp}`;
  const nombreTareaPrueba = `Tarea e2e-cu06 ${timestamp}`;

  const cleanupTestData = async () => {
    const clientesPrueba = await prismaService.cliente.findMany({
      where: {
        correo: {
          contains: 'e2e-cu06',
        },
      },
      select: {
        idCliente: true,
      },
    });

    const clientesIds = clientesPrueba.map((cliente) => cliente.idCliente);

    if (clientesIds.length === 0) {
      return;
    }

    const proyectosPrueba = await prismaService.proyecto.findMany({
      where: {
        idCliente: {
          in: clientesIds,
        },
      },
      select: {
        idProyecto: true,
      },
    });

    const proyectosIds = proyectosPrueba.map((proyecto) => proyecto.idProyecto);

    if (proyectosIds.length > 0) {
      const cronogramasPrueba = await prismaService.cronograma.findMany({
        where: {
          idProyecto: {
            in: proyectosIds,
          },
        },
        select: {
          idCronograma: true,
        },
      });

      const cronogramasIds = cronogramasPrueba.map(
        (cronograma) => cronograma.idCronograma,
      );

      if (cronogramasIds.length > 0) {
        const tareasPrueba = await prismaService.tarea.findMany({
          where: {
            idCronograma: {
              in: cronogramasIds,
            },
          },
          select: {
            idTarea: true,
          },
        });

        const tareasIds = tareasPrueba.map((tarea) => tarea.idTarea);

        if (tareasIds.length > 0) {
          await prismaService.seguimiento.deleteMany({
            where: {
              idTarea: {
                in: tareasIds,
              },
            },
          });

          await prismaService.tarea.deleteMany({
            where: {
              idTarea: {
                in: tareasIds,
              },
            },
          });
        }

        await prismaService.cronograma.deleteMany({
          where: {
            idCronograma: {
              in: cronogramasIds,
            },
          },
        });
      }

      await prismaService.proyecto.deleteMany({
        where: {
          idProyecto: {
            in: proyectosIds,
          },
        },
      });
    }

    await prismaService.cliente.deleteMany({
      where: {
        idCliente: {
          in: clientesIds,
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

    await cleanupTestData();

    const clientePrueba = await prismaService.cliente.create({
      data: {
        nombre: 'Cliente E2E CU06',
        direccion: 'Av. Seguimiento 123',
        telefono: `77${timestamp.toString().slice(-6)}`,
        correo: correoClientePrueba,
        tipoCliente: 'EMPRESA',
      },
    });

    clientePruebaId = clientePrueba.idCliente;

    const proyectoPrueba = await prismaService.proyecto.create({
      data: {
        idCliente: clientePruebaId,
        nombre: nombreProyectoPrueba,
        descripcion: 'Proyecto de prueba E2E CU06',
        ubicacion: 'La Paz',
        presupuesto: 250000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-09-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Especificaciones tecnicas E2E CU06',
      },
    });

    proyectoPruebaId = proyectoPrueba.idProyecto;

    const cronogramaPrueba = await prismaService.cronograma.create({
      data: {
        idProyecto: proyectoPruebaId,
        nombre: `Cronograma e2e-cu06 ${timestamp}`,
        fechaCreacion: new Date('2026-05-02T00:00:00.000Z'),
        estadoCronograma: EstadoCronograma.PLANIFICADO,
        accionesAnteRetraso: 'Monitorear seguimiento',
      },
    });

    cronogramaPruebaId = cronogramaPrueba.idCronograma;

    const tareaPrueba = await prismaService.tarea.create({
      data: {
        idCronograma: cronogramaPruebaId,
        nombre: nombreTareaPrueba,
        descripcion: 'Tarea para seguimiento E2E CU06',
        tipoTarea: TipoTarea.OBRA_BRUTA,
        perfilRequerido: OcupacionTrabajador.ALBANIL,
        duracionEstimada: 8,
        fechaInicioPlanificada: new Date('2026-05-10T00:00:00.000Z'),
        fechaFinPlanificada: new Date('2099-12-31T00:00:00.000Z'),
        estadoTarea: EstadoTarea.PENDIENTE,
        prioridad: PrioridadTarea.MEDIA,
      },
    });

    tareaPruebaId = tareaPrueba.idTarea;
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo principal de CU06', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/cu06/seguimientos')
      .send({
        idTarea: tareaPruebaId,
        fechaSeguimiento: '2026-05-12T00:00:00.000Z',
        estadoReportado: 'Avance inicial',
        cantidadMaterialUsado: 10,
        porcentajeAvance: 30,
        observaciones: 'Seguimiento e2e-cu06 inicial',
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idSeguimiento: expectAnyNumber(),
        idTarea: tareaPruebaId,
        estadoReportado: 'Avance inicial',
        cantidadMaterialUsado: 10,
        porcentajeAvance: 30,
        observaciones: 'Seguimiento e2e-cu06 inicial',
      }),
    });

    const createResponseBody = getSuccessBody<{ idSeguimiento: number }>(
      createResponse,
    );

    seguimientoCreadoId = createResponseBody.data.idSeguimiento;

    await request(app.getHttpServer())
      .post('/cu06/seguimientos')
      .send({
        idTarea: 999999,
        fechaSeguimiento: '2026-05-12T00:00:00.000Z',
        estadoReportado: 'Invalido',
        cantidadMaterialUsado: 5,
        porcentajeAvance: 20,
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu06/seguimientos',
          message: 'No se encontro la tarea con id 999999.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .post('/cu06/seguimientos')
      .send({
        idTarea: tareaPruebaId,
        fechaSeguimiento: '2026-05-12T00:00:00.000Z',
        estadoReportado: 'Porcentaje invalido',
        cantidadMaterialUsado: 5,
        porcentajeAvance: 101,
      })
      .expect(400)
      .expect((response) => {
        const body = getErrorBody(response);
        expect(body.success).toBe(false);
        expect(body.statusCode).toBe(400);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(body.path).toBe('/cu06/seguimientos');
        expect(body.message).toBe(
          'porcentajeAvance must not be greater than 100',
        );
        expect(body.errors).toContain(
          'porcentajeAvance must not be greater than 100',
        );
      });

    await request(app.getHttpServer())
      .get('/cu06/seguimientos')
      .query({
        idTarea: tareaPruebaId,
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<Array<{ idSeguimiento: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (seguimiento: { idSeguimiento: number }) =>
              seguimiento.idSeguimiento === seguimientoCreadoId,
          ),
        ).toBe(true);
      });

    await request(app.getHttpServer())
      .get(`/cu06/seguimientos/${seguimientoCreadoId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idSeguimiento: seguimientoCreadoId,
            idTarea: tareaPruebaId,
            estadoReportado: 'Avance inicial',
          }),
        });
      });

    await request(app.getHttpServer())
      .patch(`/cu06/seguimientos/${seguimientoCreadoId}`)
      .send({
        estadoReportado: 'Avance actualizado',
        porcentajeAvance: 55,
        observaciones: 'Seguimiento e2e-cu06 actualizado',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idSeguimiento: seguimientoCreadoId,
            estadoReportado: 'Avance actualizado',
            porcentajeAvance: 55,
            observaciones: 'Seguimiento e2e-cu06 actualizado',
          }),
        });
      });

    await request(app.getHttpServer())
      .get(`/cu06/seguimientos/tareas/${tareaPruebaId}/desviacion`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            idTarea: tareaPruebaId,
            diasDesviacion: 0,
            atrasada: false,
          },
        });
      });
  });
});
