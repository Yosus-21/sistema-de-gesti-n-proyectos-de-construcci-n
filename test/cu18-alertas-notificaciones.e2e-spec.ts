import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import {
  EstadoAlerta,
  EstadoCronograma,
  EstadoProyecto,
  EstadoTarea,
  MetodoNotificacion,
  OcupacionTrabajador,
  PrioridadTarea,
  TipoAlerta,
  TipoMaterial,
  TipoTarea,
} from './../src/domain';
import { PrismaService } from './../src/infrastructure';
import {
  expectAnyNumber,
  expectAnyString,
  expectObjectContaining,
  getSuccessBody,
} from './helpers/e2e-response.types';

describe('CU18 Alertas y Notificaciones (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let clientePruebaId: number;
  let proyectoPruebaId: number;
  let cronogramaPruebaId: number;
  let alertaCreadaId: number | undefined;

  const timestamp = Date.now();
  const correoClientePrueba = `cliente-e2e-cu18-${timestamp}@example.com`;
  const nombreProyectoPrueba = `Proyecto e2e-cu18 ${timestamp}`;
  const nombreCronogramaPrueba = `Cronograma e2e-cu18 ${timestamp}`;
  const nombreTareaPrueba = `Tarea e2e-cu18 ${timestamp}`;
  const nombreMaterialPrueba = `Material e2e-cu18 ${timestamp}`;

  const cleanupTestData = async () => {
    const clientesPrueba = await prismaService.cliente.findMany({
      where: {
        correo: {
          contains: 'e2e-cu18',
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
          contains: 'e2e-cu18',
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

    const cronogramasPrueba =
      proyectosIds.length > 0
        ? await prismaService.cronograma.findMany({
            where: {
              idProyecto: {
                in: proyectosIds,
              },
            },
            select: {
              idCronograma: true,
            },
          })
        : [];

    const cronogramasIds = cronogramasPrueba.map(
      (cronograma) => cronograma.idCronograma,
    );

    const tareasPrueba =
      cronogramasIds.length > 0
        ? await prismaService.tarea.findMany({
            where: {
              idCronograma: {
                in: cronogramasIds,
              },
            },
            select: {
              idTarea: true,
            },
          })
        : [];

    const tareasIds = tareasPrueba.map((tarea) => tarea.idTarea);

    if (
      proyectosIds.length > 0 ||
      tareasIds.length > 0 ||
      materialesIds.length > 0
    ) {
      const condiciones: Array<Record<string, unknown>> = [];

      if (proyectosIds.length > 0) {
        condiciones.push({
          idProyecto: {
            in: proyectosIds,
          },
        });
      }

      if (tareasIds.length > 0) {
        condiciones.push({
          idTarea: {
            in: tareasIds,
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

      await prismaService.alerta.deleteMany({
        where: {
          OR: condiciones,
        },
      });
    }

    if (tareasIds.length > 0) {
      await prismaService.tarea.deleteMany({
        where: {
          idTarea: {
            in: tareasIds,
          },
        },
      });
    }

    if (cronogramasIds.length > 0) {
      await prismaService.cronograma.deleteMany({
        where: {
          idCronograma: {
            in: cronogramasIds,
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
        nombre: 'Cliente E2E CU18',
        direccion: 'Av. Alertas 1800',
        telefono: `71${timestamp.toString().slice(-6)}`,
        correo: correoClientePrueba,
        tipoCliente: 'EMPRESA',
      },
    });

    clientePruebaId = clientePrueba.idCliente;

    const proyectoPrueba = await prismaService.proyecto.create({
      data: {
        idCliente: clientePruebaId,
        nombre: nombreProyectoPrueba,
        descripcion: 'Proyecto de prueba E2E CU18',
        ubicacion: 'Oruro',
        presupuesto: 275000,
        fechaInicio: new Date('2027-01-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2027-04-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs CU18',
      },
    });

    proyectoPruebaId = proyectoPrueba.idProyecto;

    const cronogramaPrueba = await prismaService.cronograma.create({
      data: {
        idProyecto: proyectoPruebaId,
        nombre: nombreCronogramaPrueba,
        fechaCreacion: new Date('2027-01-01T00:00:00.000Z'),
        estadoCronograma: EstadoCronograma.PLANIFICADO,
      },
    });

    cronogramaPruebaId = cronogramaPrueba.idCronograma;

    await prismaService.tarea.create({
      data: {
        idCronograma: cronogramaPruebaId,
        nombre: nombreTareaPrueba,
        descripcion: 'Tarea de prueba E2E CU18',
        tipoTarea: TipoTarea.OBRA_BRUTA,
        perfilRequerido: OcupacionTrabajador.ALBANIL,
        duracionEstimada: 3,
        fechaInicioPlanificada: new Date('2027-01-10T00:00:00.000Z'),
        fechaFinPlanificada: new Date('2027-01-13T00:00:00.000Z'),
        estadoTarea: EstadoTarea.PENDIENTE,
        prioridad: PrioridadTarea.MEDIA,
      },
    });

    await prismaService.material.create({
      data: {
        nombre: nombreMaterialPrueba,
        descripcion: 'Material de prueba E2E CU18',
        tipoMaterial: TipoMaterial.GENERAL,
        unidad: 'unidad',
        cantidadDisponible: 20,
        costoUnitario: 9,
        especificacionesTecnicas: 'Specs material CU18',
      },
    });
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo principal de CU18', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/cu18/alertas-notificaciones')
      .send({
        idProyecto: proyectoPruebaId,
        criterioActivacion: 'Presupuesto mayor al 90%',
        tipoAlerta: TipoAlerta.PLAZO_CRITICO,
        metodoNotificacion: MetodoNotificacion.SISTEMA,
        mensajeNotificacion: 'Alerta inicial del proyecto',
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idAlerta: expectAnyNumber(),
        idProyecto: proyectoPruebaId,
        criterioActivacion: 'Presupuesto mayor al 90%',
        tipoAlerta: TipoAlerta.PLAZO_CRITICO,
        metodoNotificacion: MetodoNotificacion.SISTEMA,
        mensajeNotificacion: 'Alerta inicial del proyecto',
        estadoAlerta: EstadoAlerta.ACTIVA,
      }),
    });

    const createResponseBody = getSuccessBody<{ idAlerta: number }>(
      createResponse,
    );

    alertaCreadaId = createResponseBody.data.idAlerta;

    await request(app.getHttpServer())
      .post('/cu18/alertas-notificaciones')
      .send({
        criterioActivacion: 'Sin destino',
        tipoAlerta: TipoAlerta.RETRASO_TAREA,
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: '/cu18/alertas-notificaciones',
          message:
            'Debe informar al menos un destino para la alerta: proyecto, tarea o material.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .post('/cu18/alertas-notificaciones')
      .send({
        idProyecto: 999999,
        criterioActivacion: 'Proyecto faltante',
        tipoAlerta: TipoAlerta.PLAZO_CRITICO,
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu18/alertas-notificaciones',
          message: 'No se encontro el proyecto con id 999999.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .get('/cu18/alertas-notificaciones')
      .query({
        idProyecto: proyectoPruebaId,
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<Array<{ idAlerta: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (alerta: { idAlerta: number }) =>
              alerta.idAlerta === alertaCreadaId,
          ),
        ).toBe(true);
      });

    await request(app.getHttpServer())
      .get(`/cu18/alertas-notificaciones/${alertaCreadaId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idAlerta: alertaCreadaId,
            idProyecto: proyectoPruebaId,
            estadoAlerta: EstadoAlerta.ACTIVA,
          }),
        });
      });

    await request(app.getHttpServer())
      .post(`/cu18/alertas-notificaciones/${alertaCreadaId}/notificar`)
      .send({
        mensajeNotificacion: 'Notificación provisional de proyecto',
        metodoNotificacion: MetodoNotificacion.SISTEMA,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            idAlerta: alertaCreadaId,
            notificada: true,
            metodoNotificacion: MetodoNotificacion.SISTEMA,
            mensajeNotificacion: 'Notificación provisional de proyecto',
            fechaGeneracion: expectAnyString(),
          },
        });
      });

    await request(app.getHttpServer())
      .patch(`/cu18/alertas-notificaciones/${alertaCreadaId}/desactivar`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idAlerta: alertaCreadaId,
            estadoAlerta: EstadoAlerta.INACTIVA,
          }),
        });
      });

    await request(app.getHttpServer())
      .post(`/cu18/alertas-notificaciones/${alertaCreadaId}/notificar`)
      .send({
        mensajeNotificacion: 'Intento inválido',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: `/cu18/alertas-notificaciones/${alertaCreadaId}/notificar`,
          message:
            'No se puede generar una notificación para una alerta inactiva.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .patch(`/cu18/alertas-notificaciones/${alertaCreadaId}/activar`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idAlerta: alertaCreadaId,
            estadoAlerta: EstadoAlerta.ACTIVA,
          }),
        });
      });
  });
});
