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

describe('CU11 Asignacion de Tareas por parte del Contratista (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let clientePruebaId: number;
  let proyectoPruebaId: number;
  let cronogramaPruebaId: number;
  let tareaObraBrutaId: number;
  let trabajadorCompatibleId: number;
  let trabajadorCompatibleDosId: number;
  let trabajadorIncompatibleId: number;
  let contratistaPruebaId: number;
  let asignacionCreadaId: number | undefined;

  const timestamp = Date.now();
  const correoClientePrueba = `cliente-e2e-cu11-${timestamp}@example.com`;
  const correoContratistaPrueba = `contratista-e2e-cu11-${timestamp}@example.com`;
  const ciContratistaPrueba = `E2E-CU11-CONTR-${timestamp}`;
  const nombreProyectoPrueba = `Proyecto e2e-cu11 ${timestamp}`;
  const nombreCronogramaPrueba = `Cronograma e2e-cu11 ${timestamp}`;
  const nombreTareaPrueba = `Tarea obra bruta e2e-cu11 ${timestamp}`;
  const correoTrabajadorCompatible = `trabajador-compatible-e2e-cu11-${timestamp}@example.com`;
  const correoTrabajadorCompatibleDos = `trabajador-compatible2-e2e-cu11-${timestamp}@example.com`;
  const correoTrabajadorIncompatible = `trabajador-incompatible-e2e-cu11-${timestamp}@example.com`;
  const ciTrabajadorCompatible = `E2E-CU11-COMP-${timestamp}`;
  const ciTrabajadorCompatibleDos = `E2E-CU11-COMP2-${timestamp}`;
  const ciTrabajadorIncompatible = `E2E-CU11-INCOMP-${timestamp}`;

  const cleanupTestData = async () => {
    const clientesPrueba = await prismaService.cliente.findMany({
      where: {
        correo: {
          contains: 'e2e-cu11',
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
              contains: 'e2e-cu11',
            },
          },
          {
            ci: {
              contains: 'E2E-CU11',
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

    const contratistasPrueba = await prismaService.contratista.findMany({
      where: {
        OR: [
          {
            correo: {
              contains: 'e2e-cu11',
            },
          },
          {
            ci: {
              contains: 'E2E-CU11-CONTR',
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
    await cleanupTestData();

    const clientePrueba = await prismaService.cliente.create({
      data: {
        nombre: 'Cliente E2E CU11',
        direccion: 'Av. Contratista 123',
        telefono: `76${timestamp.toString().slice(-6)}`,
        correo: correoClientePrueba,
        tipoCliente: 'EMPRESA',
      },
    });

    clientePruebaId = clientePrueba.idCliente;

    const proyectoPrueba = await prismaService.proyecto.create({
      data: {
        idCliente: clientePruebaId,
        nombre: nombreProyectoPrueba,
        descripcion: 'Proyecto de prueba E2E CU11',
        ubicacion: 'La Paz',
        presupuesto: 300000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-10-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs CU11',
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
        descripcion: 'Tarea de obra bruta para contratista',
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
        nombre: 'Trabajador Compatible E2E CU11',
        ci: ciTrabajadorCompatible,
        telefono: '70000111',
        correo: correoTrabajadorCompatible,
        licenciaProfesional: 'LP-CU11',
        aniosExperiencia: 9,
        especializaciones: 'Albanileria',
        certificaciones: 'Seguridad',
        ocupacion: OcupacionTrabajador.ALBANIL,
      },
    });

    trabajadorCompatibleId = trabajadorCompatible.idTrabajador;

    const trabajadorCompatibleDos = await prismaService.trabajador.create({
      data: {
        nombre: 'Trabajador Compatible Dos E2E CU11',
        ci: ciTrabajadorCompatibleDos,
        telefono: '70000112',
        correo: correoTrabajadorCompatibleDos,
        licenciaProfesional: 'LP-CU11-2',
        aniosExperiencia: 7,
        especializaciones: 'Plomeria',
        certificaciones: 'Seguridad',
        ocupacion: OcupacionTrabajador.PLOMERO,
      },
    });

    trabajadorCompatibleDosId = trabajadorCompatibleDos.idTrabajador;

    const trabajadorIncompatible = await prismaService.trabajador.create({
      data: {
        nombre: 'Trabajador Incompatible E2E CU11',
        ci: ciTrabajadorIncompatible,
        telefono: '70000113',
        correo: correoTrabajadorIncompatible,
        licenciaProfesional: 'LP-CU11-3',
        aniosExperiencia: 4,
        especializaciones: 'Carpinteria',
        certificaciones: 'Corte',
        ocupacion: OcupacionTrabajador.CARPINTERO,
      },
    });

    trabajadorIncompatibleId = trabajadorIncompatible.idTrabajador;

    const contratistaPrueba = await prismaService.contratista.create({
      data: {
        nombre: 'Contratista E2E CU11',
        ci: ciContratistaPrueba,
        empresa: 'Constructora E2E CU11',
        telefono: '70000114',
        correo: correoContratistaPrueba,
      },
    });

    contratistaPruebaId = contratistaPrueba.idContratista;
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo principal de CU11', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/cu11/asignaciones-contratista')
      .send({
        idTarea: tareaObraBrutaId,
        idTrabajador: trabajadorCompatibleId,
        idContratista: contratistaPruebaId,
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
        asignadaPorContratista: true,
      }),
    });

    const createResponseBody = getSuccessBody<{ idAsignacionTarea: number }>(
      createResponse,
    );

    asignacionCreadaId = createResponseBody.data.idAsignacionTarea;

    await request(app.getHttpServer())
      .post('/cu11/asignaciones-contratista')
      .send({
        idTarea: tareaObraBrutaId,
        idTrabajador: trabajadorCompatibleId,
        idContratista: contratistaPruebaId,
        fechaAsignacion: '2026-05-11T00:00:00.000Z',
        rolEnLaTarea: 'Operario duplicado',
      })
      .expect(409)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 409,
          timestamp: expectAnyString(),
          path: '/cu11/asignaciones-contratista',
          message:
            'Ya existe una asignacion activa para este trabajador en la tarea indicada.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .post('/cu11/asignaciones-contratista')
      .send({
        idTarea: 999999,
        idTrabajador: trabajadorCompatibleId,
        idContratista: contratistaPruebaId,
        fechaAsignacion: '2026-05-10T00:00:00.000Z',
        rolEnLaTarea: 'Inexistente',
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu11/asignaciones-contratista',
          message: 'No se encontro la tarea con id 999999.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .post('/cu11/asignaciones-contratista')
      .send({
        idTarea: tareaObraBrutaId,
        idTrabajador: trabajadorIncompatibleId,
        idContratista: contratistaPruebaId,
        fechaAsignacion: '2026-05-10T00:00:00.000Z',
        rolEnLaTarea: 'Operario incompatible',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: '/cu11/asignaciones-contratista',
          message:
            'El trabajador no tiene una ocupacion compatible con obra bruta.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .post('/cu11/asignaciones-contratista')
      .send({
        idTarea: tareaObraBrutaId,
        idTrabajador: trabajadorCompatibleId,
        idContratista: 999999,
        fechaAsignacion: '2026-05-10T00:00:00.000Z',
        rolEnLaTarea: 'Contratista inexistente',
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu11/asignaciones-contratista',
          message: 'No se encontro el contratista con id 999999.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .get('/cu11/asignaciones-contratista')
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
      .get(`/cu11/asignaciones-contratista/${asignacionCreadaId}`)
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
            asignadaPorContratista: true,
          }),
        });
      });

    await request(app.getHttpServer())
      .patch(`/cu11/asignaciones-contratista/${asignacionCreadaId}/reasignar`)
      .send({
        idNuevoTrabajador: trabajadorCompatibleDosId,
        motivoReasignacion: 'Cambio de cuadrilla',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idAsignacionTarea: asignacionCreadaId,
            idTrabajador: trabajadorCompatibleDosId,
            estadoAsignacion: 'REASIGNADA',
            observaciones: 'Cambio de cuadrilla',
            asignadaPorContratista: true,
          }),
        });
      });

    await request(app.getHttpServer())
      .patch(`/cu11/asignaciones-contratista/${asignacionCreadaId}/cancelar`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idAsignacionTarea: asignacionCreadaId,
            estadoAsignacion: 'CANCELADA',
            asignadaPorContratista: true,
          }),
        });
      });
  });
});
