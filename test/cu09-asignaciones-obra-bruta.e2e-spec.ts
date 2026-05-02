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
} from './helpers/e2e-response.types';

describe('CU09 Asignacion de Tareas de Obra Bruta (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let clientePruebaId: number;
  let proyectoPruebaId: number;
  let cronogramaPruebaId: number;
  let tareaObraBrutaId: number;
  let trabajadorCompatibleId: number;
  let trabajadorIncompatibleId: number;
  let asignacionCreadaId: number | undefined;

  const timestamp = Date.now();
  const correoClientePrueba = `cliente-e2e-cu09-${timestamp}@example.com`;
  const nombreProyectoPrueba = `Proyecto e2e-cu09 ${timestamp}`;
  const nombreCronogramaPrueba = `Cronograma e2e-cu09 ${timestamp}`;
  const nombreTareaPrueba = `Tarea obra bruta e2e-cu09 ${timestamp}`;
  const correoTrabajadorCompatible = `trabajador-compatible-e2e-cu09-${timestamp}@example.com`;
  const correoTrabajadorIncompatible = `trabajador-incompatible-e2e-cu09-${timestamp}@example.com`;
  const ciTrabajadorCompatible = `E2E-CU09-COMP-${timestamp}`;
  const ciTrabajadorIncompatible = `E2E-CU09-INCOMP-${timestamp}`;

  const cleanupTestData = async () => {
    const clientesPrueba = await prismaService.cliente.findMany({
      where: {
        correo: {
          contains: 'e2e-cu09',
        },
      },
      select: {
        idCliente: true,
      },
    });

    const clientesIds = clientesPrueba.map((cliente) => cliente.idCliente);

    const trabajadoresPrueba = await prismaService.trabajador.findMany({
      where: {
        OR: [
          {
            correo: {
              contains: 'e2e-cu09',
            },
          },
          {
            ci: {
              contains: 'E2E-CU09',
            },
          },
        ],
      },
      select: {
        idTrabajador: true,
      },
    });

    const trabajadoresIds = trabajadoresPrueba.map(
      (trabajador) => trabajador.idTrabajador,
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

    if (tareasIds.length > 0 || trabajadoresIds.length > 0) {
      const condiciones: Array<Record<string, unknown>> = [];

      if (tareasIds.length > 0) {
        condiciones.push({
          idTarea: {
            in: tareasIds,
          },
        });
      }

      if (trabajadoresIds.length > 0) {
        condiciones.push({
          idTrabajador: {
            in: trabajadoresIds,
          },
        });
      }

      await prismaService.asignacionTarea.deleteMany({
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

    if (trabajadoresIds.length > 0) {
      await prismaService.trabajador.deleteMany({
        where: {
          idTrabajador: {
            in: trabajadoresIds,
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
        nombre: 'Cliente E2E CU09',
        direccion: 'Av. Asignaciones 123',
        telefono: `74${timestamp.toString().slice(-6)}`,
        correo: correoClientePrueba,
        tipoCliente: 'EMPRESA',
      },
    });

    clientePruebaId = clientePrueba.idCliente;

    const proyectoPrueba = await prismaService.proyecto.create({
      data: {
        idCliente: clientePruebaId,
        nombre: nombreProyectoPrueba,
        descripcion: 'Proyecto de prueba E2E CU09',
        ubicacion: 'La Paz',
        presupuesto: 280000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-10-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs CU09',
      },
    });

    proyectoPruebaId = proyectoPrueba.idProyecto;

    const cronogramaPrueba = await prismaService.cronograma.create({
      data: {
        idProyecto: proyectoPruebaId,
        nombre: nombreCronogramaPrueba,
        fechaCreacion: new Date('2026-05-01T00:00:00.000Z'),
        estadoCronograma: EstadoCronograma.PLANIFICADO,
      },
    });

    cronogramaPruebaId = cronogramaPrueba.idCronograma;

    const tareaPrueba = await prismaService.tarea.create({
      data: {
        idCronograma: cronogramaPruebaId,
        nombre: nombreTareaPrueba,
        descripcion: 'Tarea de obra bruta para asignacion',
        tipoTarea: TipoTarea.OBRA_BRUTA,
        perfilRequerido: OcupacionTrabajador.ALBANIL,
        duracionEstimada: 4,
        fechaInicioPlanificada: new Date('2026-05-10T00:00:00.000Z'),
        fechaFinPlanificada: new Date('2026-05-14T00:00:00.000Z'),
        estadoTarea: EstadoTarea.PENDIENTE,
        prioridad: PrioridadTarea.MEDIA,
      },
    });

    tareaObraBrutaId = tareaPrueba.idTarea;

    const trabajadorCompatible = await prismaService.trabajador.create({
      data: {
        nombre: 'Trabajador Compatible E2E CU09',
        ci: ciTrabajadorCompatible,
        telefono: '70000091',
        correo: correoTrabajadorCompatible,
        licenciaProfesional: 'LP-CU09',
        aniosExperiencia: 9,
        especializaciones: 'Estructuras',
        certificaciones: 'Seguridad',
        ocupacion: OcupacionTrabajador.ALBANIL,
      },
    });

    trabajadorCompatibleId = trabajadorCompatible.idTrabajador;

    const trabajadorIncompatible = await prismaService.trabajador.create({
      data: {
        nombre: 'Trabajador Incompatible E2E CU09',
        ci: ciTrabajadorIncompatible,
        telefono: '70000092',
        correo: correoTrabajadorIncompatible,
        licenciaProfesional: 'LP-CU09-2',
        aniosExperiencia: 4,
        especializaciones: 'Carpinteria',
        certificaciones: 'Corte',
        ocupacion: OcupacionTrabajador.CARPINTERO,
      },
    });

    trabajadorIncompatibleId = trabajadorIncompatible.idTrabajador;
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo principal de CU09', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/cu09/asignaciones-obra-bruta')
      .send({
        idTarea: tareaObraBrutaId,
        idTrabajador: trabajadorCompatibleId,
        fechaAsignacion: '2026-05-10T00:00:00.000Z',
        rolEnLaTarea: 'Operario principal',
        observaciones: 'Asignacion inicial E2E',
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idAsignacionTarea: expectAnyNumber(),
        idTarea: tareaObraBrutaId,
        idTrabajador: trabajadorCompatibleId,
        rolEnLaTarea: 'Operario principal',
        estadoAsignacion: 'CONFIRMADA',
        asignadaPorContratista: false,
      }),
    });

    const createResponseBody = getSuccessBody<{ idAsignacionTarea: number }>(
      createResponse,
    );

    asignacionCreadaId = createResponseBody.data.idAsignacionTarea;

    await request(app.getHttpServer())
      .post('/cu09/asignaciones-obra-bruta')
      .send({
        idTarea: tareaObraBrutaId,
        idTrabajador: trabajadorCompatibleId,
        fechaAsignacion: '2026-05-11T00:00:00.000Z',
        rolEnLaTarea: 'Operario duplicado',
      })
      .expect(409)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 409,
          timestamp: expectAnyString(),
          path: '/cu09/asignaciones-obra-bruta',
          message:
            'Ya existe una asignacion activa para este trabajador en la tarea indicada.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .post('/cu09/asignaciones-obra-bruta')
      .send({
        idTarea: 999999,
        idTrabajador: trabajadorCompatibleId,
        fechaAsignacion: '2026-05-10T00:00:00.000Z',
        rolEnLaTarea: 'Inexistente',
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu09/asignaciones-obra-bruta',
          message: 'No se encontro la tarea con id 999999.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .post('/cu09/asignaciones-obra-bruta')
      .send({
        idTarea: tareaObraBrutaId,
        idTrabajador: trabajadorIncompatibleId,
        fechaAsignacion: '2026-05-10T00:00:00.000Z',
        rolEnLaTarea: 'Operario incompatible',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: '/cu09/asignaciones-obra-bruta',
          message:
            'El trabajador no tiene una ocupacion compatible con obra bruta.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .get('/cu09/asignaciones-obra-bruta')
      .query({
        idTarea: tareaObraBrutaId,
        idTrabajador: trabajadorCompatibleId,
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body =
          getSuccessBody<Array<{ idAsignacionTarea: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (asignacion: { idAsignacionTarea: number }) =>
              asignacion.idAsignacionTarea === asignacionCreadaId,
          ),
        ).toBe(true);
      });

    await request(app.getHttpServer())
      .get(`/cu09/asignaciones-obra-bruta/${asignacionCreadaId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idAsignacionTarea: asignacionCreadaId,
            idTarea: tareaObraBrutaId,
            idTrabajador: trabajadorCompatibleId,
            estadoAsignacion: 'CONFIRMADA',
          }),
        });
      });

    await request(app.getHttpServer())
      .patch(`/cu09/asignaciones-obra-bruta/${asignacionCreadaId}`)
      .send({
        rolEnLaTarea: 'Supervisor de cuadrilla',
        observaciones: 'Ajuste operativo',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idAsignacionTarea: asignacionCreadaId,
            rolEnLaTarea: 'Supervisor de cuadrilla',
            observaciones: 'Ajuste operativo',
            asignadaPorContratista: false,
          }),
        });
      });

    await request(app.getHttpServer())
      .patch(`/cu09/asignaciones-obra-bruta/${asignacionCreadaId}/cancelar`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idAsignacionTarea: asignacionCreadaId,
            estadoAsignacion: 'CANCELADA',
          }),
        });
      });
  });
});
