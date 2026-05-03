import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import {
  EstadoCronograma,
  EstadoProyecto,
  EstadoTarea,
  OcupacionTrabajador,
  PrioridadTarea,
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
import {
  createAuthorizedRequest,
  getAdminAuthHeaders,
} from './helpers/auth-e2e.helper';

describe('CU16 Asignacion Eficiente de Materiales mediante IA (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let authHeaders: { Authorization: string };
  let clientePruebaId: number;
  let proyectoPruebaId: number;
  let cronogramaPruebaId: number;
  let tareaPruebaId: number;
  let materialPruebaId: number;
  let asignacionCreadaId: number | undefined;

  const timestamp = Date.now();
  const correoClientePrueba = `cliente-e2e-cu16-${timestamp}@example.com`;
  const nombreProyectoPrueba = `Proyecto e2e-cu16 ${timestamp}`;
  const nombreCronogramaPrueba = `Cronograma e2e-cu16 ${timestamp}`;
  const nombreTareaPrueba = `Tarea e2e-cu16 ${timestamp}`;
  const nombreMaterialPrueba = `Material e2e-cu16 ${timestamp}`;

  const cleanupTestData = async () => {
    const clientesPrueba = await prismaService.cliente.findMany({
      where: {
        correo: {
          contains: 'e2e-cu16',
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
          contains: 'e2e-cu16',
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

    if (tareasIds.length > 0 || materialesIds.length > 0) {
      const condiciones: Array<Record<string, unknown>> = [];

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

      await prismaService.asignacionMaterial.deleteMany({
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
    authHeaders = await getAdminAuthHeaders(
      app,
      prismaService,
      'e2e-cu16-auth',
    );
    await cleanupTestData();

    const clientePrueba = await prismaService.cliente.create({
      data: {
        nombre: 'Cliente E2E CU16',
        direccion: 'Av. Materiales 1600',
        telefono: `73${timestamp.toString().slice(-6)}`,
        correo: correoClientePrueba,
        tipoCliente: 'EMPRESA',
      },
    });

    clientePruebaId = clientePrueba.idCliente;

    const proyectoPrueba = await prismaService.proyecto.create({
      data: {
        idCliente: clientePruebaId,
        nombre: nombreProyectoPrueba,
        descripcion: 'Proyecto de prueba E2E CU16',
        ubicacion: 'Santa Cruz',
        presupuesto: 520000,
        fechaInicio: new Date('2026-09-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2027-01-15T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs CU16',
      },
    });

    proyectoPruebaId = proyectoPrueba.idProyecto;

    const cronogramaPrueba = await prismaService.cronograma.create({
      data: {
        idProyecto: proyectoPruebaId,
        nombre: nombreCronogramaPrueba,
        fechaCreacion: new Date('2026-09-01T00:00:00.000Z'),
        estadoCronograma: EstadoCronograma.PLANIFICADO,
      },
    });

    cronogramaPruebaId = cronogramaPrueba.idCronograma;

    const tareaPrueba = await prismaService.tarea.create({
      data: {
        idCronograma: cronogramaPruebaId,
        nombre: nombreTareaPrueba,
        descripcion: 'Tarea de prueba E2E CU16',
        tipoTarea: TipoTarea.OBRA_BRUTA,
        perfilRequerido: OcupacionTrabajador.ALBANIL,
        duracionEstimada: 5,
        fechaInicioPlanificada: new Date('2026-09-10T00:00:00.000Z'),
        fechaFinPlanificada: new Date('2026-09-15T00:00:00.000Z'),
        estadoTarea: EstadoTarea.PENDIENTE,
        prioridad: PrioridadTarea.MEDIA,
      },
    });

    tareaPruebaId = tareaPrueba.idTarea;

    const materialPrueba = await prismaService.material.create({
      data: {
        nombre: nombreMaterialPrueba,
        descripcion: 'Material de prueba E2E CU16',
        tipoMaterial: TipoMaterial.GENERAL,
        unidad: 'unidad',
        cantidadDisponible: 999999,
        costoUnitario: 10,
        especificacionesTecnicas: 'Specs material CU16',
      },
    });

    materialPruebaId = materialPrueba.idMaterial;
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo principal de CU16', async () => {
    const api = createAuthorizedRequest(app, authHeaders);
    const propuestaResponse = await api
      .post('/cu16/asignacion-materiales-ia/propuestas')
      .send({
        idProyecto: proyectoPruebaId,
        idTarea: tareaPruebaId,
        criteriosPrioridad: 'priorizar stock disponible',
        costoMaximoPermitido: 15,
        restricciones: 'uso en fase inicial',
      })
      .expect(201);

    expect(propuestaResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idAsignacionMaterial: expectAnyNumber(),
        idTarea: tareaPruebaId,
        idMaterial: materialPruebaId,
        cantidadAsignada: 1,
        estadoAsignacion: 'PENDIENTE',
        generadaPorIa: true,
      }),
    });

    const propuestaResponseBody = getSuccessBody<{
      idAsignacionMaterial: number;
    }>(propuestaResponse);

    asignacionCreadaId = propuestaResponseBody.data.idAsignacionMaterial;

    await api
      .post('/cu16/asignacion-materiales-ia/propuestas')
      .send({
        idProyecto: 999999,
        criteriosPrioridad: 'proyecto inexistente',
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu16/asignacion-materiales-ia/propuestas',
          message: 'No se encontro el proyecto con id 999999.',
          errors: [],
        });
      });

    await api
      .post('/cu16/asignacion-materiales-ia/validar-restricciones')
      .send({
        idProyecto: proyectoPruebaId,
        idTarea: tareaPruebaId,
        restricciones: 'Restringir a la fase 1',
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            valido: true,
            idProyecto: proyectoPruebaId,
            idTarea: tareaPruebaId,
            restricciones: 'Restringir a la fase 1',
            mensaje: 'Restricciones validadas de forma provisional.',
          },
        });
      });

    await api
      .get('/cu16/asignacion-materiales-ia')
      .query({
        idProyecto: proyectoPruebaId,
        idTarea: tareaPruebaId,
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body =
          getSuccessBody<Array<{ idAsignacionMaterial: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (asignacion: { idAsignacionMaterial: number }) =>
              asignacion.idAsignacionMaterial === asignacionCreadaId,
          ),
        ).toBe(true);
      });

    await api
      .patch(`/cu16/asignacion-materiales-ia/${asignacionCreadaId}/ajustar`)
      .send({
        cantidadAsignada: 2,
        costoMaximoPermitido: 11,
        restricciones: 'Ajuste manual previo a confirmacion',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idAsignacionMaterial: asignacionCreadaId,
            cantidadAsignada: 2,
            costoMaximoPermitido: 11,
            restricciones: 'Ajuste manual previo a confirmacion',
            estadoAsignacion: 'PENDIENTE',
          }),
        });
      });

    await api
      .patch(`/cu16/asignacion-materiales-ia/${asignacionCreadaId}/confirmar`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idAsignacionMaterial: asignacionCreadaId,
            estadoAsignacion: 'CONFIRMADA',
          }),
        });
      });

    const materialActualizado = await prismaService.material.findUnique({
      where: {
        idMaterial: materialPruebaId,
      },
    });

    expect(materialActualizado?.cantidadDisponible).toBe(999997);

    await api
      .patch(`/cu16/asignacion-materiales-ia/${asignacionCreadaId}/confirmar`)
      .expect(409)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 409,
          timestamp: expectAnyString(),
          path: `/cu16/asignacion-materiales-ia/${asignacionCreadaId}/confirmar`,
          message: 'La asignacion de material ya fue confirmada.',
          errors: [],
        });
      });

    await api
      .patch(`/cu16/asignacion-materiales-ia/${asignacionCreadaId}/ajustar`)
      .send({
        cantidadAsignada: 3,
        restricciones: 'Intento tardio',
      })
      .expect(409)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 409,
          timestamp: expectAnyString(),
          path: `/cu16/asignacion-materiales-ia/${asignacionCreadaId}/ajustar`,
          message:
            'No se puede ajustar una asignacion de material ya confirmada.',
          errors: [],
        });
      });
  });
});
