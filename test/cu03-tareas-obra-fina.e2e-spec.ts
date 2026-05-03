import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import {
  EstadoCronograma,
  EstadoProyecto,
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
import {
  createAuthorizedRequest,
  getAdminAuthHeaders,
} from './helpers/auth-e2e.helper';

describe('CU03 Gestion de Tareas de Obra Fina (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let authHeaders: { Authorization: string };
  let clientePruebaId: number;
  let proyectoConCronogramaId: number;
  let proyectoSinCronogramaId: number;
  let cronogramaPruebaId: number;
  let tareaCreadaId: number | undefined;

  const timestamp = Date.now();
  const correoClientePrueba = `cliente-e2e-cu03-${timestamp}@example.com`;
  const nombreProyectoConCronograma = `Proyecto con cronograma e2e-cu03 ${timestamp}`;
  const nombreProyectoSinCronograma = `Proyecto sin cronograma e2e-cu03 ${timestamp}`;
  const nombreCronogramaPrueba = `Cronograma e2e-cu03 ${timestamp}`;
  const nombreTareaPrueba = `Tarea obra fina e2e-cu03 ${timestamp}`;

  const cleanupTestData = async () => {
    const clientesPrueba = await prismaService.cliente.findMany({
      where: {
        correo: {
          contains: 'e2e-cu03',
        },
      },
      select: {
        idCliente: true,
      },
    });

    const clientesIds = clientesPrueba.map((cliente) => cliente.idCliente);

    if (clientesIds.length > 0) {
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

      const proyectosIds = proyectosPrueba.map(
        (proyecto) => proyecto.idProyecto,
      );

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
          await prismaService.tarea.deleteMany({
            where: {
              idCronograma: {
                in: cronogramasIds,
              },
            },
          });

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
      'e2e-cu03-auth',
    );

    await cleanupTestData();

    const clientePrueba = await prismaService.cliente.create({
      data: {
        nombre: 'Cliente E2E CU03',
        direccion: 'Av. Tareas 123',
        telefono: `74${timestamp.toString().slice(-6)}`,
        correo: correoClientePrueba,
        tipoCliente: 'EMPRESA',
      },
    });

    clientePruebaId = clientePrueba.idCliente;

    const proyectoConCronograma = await prismaService.proyecto.create({
      data: {
        idCliente: clientePruebaId,
        nombre: nombreProyectoConCronograma,
        descripcion: 'Proyecto con cronograma E2E CU03',
        ubicacion: 'La Paz',
        presupuesto: 200000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-09-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs CU03',
      },
    });

    proyectoConCronogramaId = proyectoConCronograma.idProyecto;

    const proyectoSinCronograma = await prismaService.proyecto.create({
      data: {
        idCliente: clientePruebaId,
        nombre: nombreProyectoSinCronograma,
        descripcion: 'Proyecto sin cronograma E2E CU03',
        ubicacion: 'La Paz',
        presupuesto: 180000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-08-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs sin cronograma',
      },
    });

    proyectoSinCronogramaId = proyectoSinCronograma.idProyecto;

    const cronogramaPrueba = await prismaService.cronograma.create({
      data: {
        idProyecto: proyectoConCronogramaId,
        nombre: nombreCronogramaPrueba,
        fechaCreacion: new Date('2026-05-01T00:00:00.000Z'),
        estadoCronograma: EstadoCronograma.PLANIFICADO,
      },
    });

    cronogramaPruebaId = cronogramaPrueba.idCronograma;
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo principal de CU03', async () => {
    const api = createAuthorizedRequest(app, authHeaders);
    const createResponse = await api
      .post('/cu03/tareas-obra-fina')
      .send({
        idProyecto: proyectoConCronogramaId,
        nombre: nombreTareaPrueba,
        descripcion: 'Instalacion de paneles de vidrio',
        perfilRequerido: OcupacionTrabajador.VIDRIERO,
        duracionEstimada: 4,
        fechaInicioPlanificada: '2026-05-10T00:00:00.000Z',
        fechaFinPlanificada: '2026-05-14T00:00:00.000Z',
        prioridad: PrioridadTarea.ALTA,
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idTarea: expectAnyNumber(),
        idCronograma: cronogramaPruebaId,
        nombre: nombreTareaPrueba,
        tipoTarea: TipoTarea.OBRA_FINA,
        estadoTarea: 'PENDIENTE',
      }),
    });

    const createResponseBody = getSuccessBody<{ idTarea: number }>(
      createResponse,
    );

    tareaCreadaId = createResponseBody.data.idTarea;

    await api
      .post('/cu03/tareas-obra-fina')
      .send({
        idProyecto: proyectoSinCronogramaId,
        nombre: `${nombreTareaPrueba} Sin Cronograma`,
        descripcion: 'No debe crearse',
        perfilRequerido: OcupacionTrabajador.CARPINTERO,
        duracionEstimada: 2,
        fechaInicioPlanificada: '2026-05-15T00:00:00.000Z',
        fechaFinPlanificada: '2026-05-17T00:00:00.000Z',
        prioridad: PrioridadTarea.MEDIA,
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu03/tareas-obra-fina',
          message: `No se encontro un cronograma para el proyecto con id ${proyectoSinCronogramaId}.`,
          errors: [],
        });
      });

    await api
      .post('/cu03/tareas-obra-fina')
      .send({
        idProyecto: proyectoConCronogramaId,
        nombre: `${nombreTareaPrueba} Fechas Invalidas`,
        descripcion: 'No debe crearse',
        perfilRequerido: OcupacionTrabajador.CARPINTERO,
        duracionEstimada: 2,
        fechaInicioPlanificada: '2026-05-20T00:00:00.000Z',
        fechaFinPlanificada: '2026-05-17T00:00:00.000Z',
        prioridad: PrioridadTarea.MEDIA,
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: '/cu03/tareas-obra-fina',
          message:
            'La fecha fin planificada no puede ser anterior a la fecha inicio planificada.',
          errors: [],
        });
      });

    await api
      .post('/cu03/tareas-obra-fina')
      .send({
        idProyecto: proyectoConCronogramaId,
        nombre: `${nombreTareaPrueba} Perfil Invalido`,
        descripcion: 'No debe crearse',
        perfilRequerido: OcupacionTrabajador.ELECTRICISTA,
        duracionEstimada: 2,
        fechaInicioPlanificada: '2026-05-16T00:00:00.000Z',
        fechaFinPlanificada: '2026-05-18T00:00:00.000Z',
        prioridad: PrioridadTarea.MEDIA,
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: '/cu03/tareas-obra-fina',
          message:
            'El perfil requerido para tareas de obra fina debe ser VIDRIERO o CARPINTERO.',
          errors: [],
        });
      });

    await api
      .get('/cu03/tareas-obra-fina')
      .query({
        idProyecto: proyectoConCronogramaId,
        busqueda: 'Tarea obra fina e2e-cu03',
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<Array<{ idTarea: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (tarea: { idTarea: number }) => tarea.idTarea === tareaCreadaId,
          ),
        ).toBe(true);
      });

    await api
      .patch(`/cu03/tareas-obra-fina/${tareaCreadaId}`)
      .send({
        nombre: `${nombreTareaPrueba} Actualizada`,
        perfilRequerido: OcupacionTrabajador.CARPINTERO,
        fechaFinPlanificada: '2026-05-15T00:00:00.000Z',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idTarea: tareaCreadaId,
            nombre: `${nombreTareaPrueba} Actualizada`,
            perfilRequerido: OcupacionTrabajador.CARPINTERO,
            tipoTarea: TipoTarea.OBRA_FINA,
          }),
        });
      });

    await api
      .delete(`/cu03/tareas-obra-fina/${tareaCreadaId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            eliminado: true,
            idTarea: tareaCreadaId,
          },
        });
      });
  });
});
