import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
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

describe('CU04 Gestion de Tareas de Obra Bruta (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let clientePruebaId: number;
  let proyectoConCronogramaId: number;
  let proyectoSinCronogramaId: number;
  let cronogramaPruebaId: number;
  let tareaCreadaId: number | undefined;

  const timestamp = Date.now();
  const correoClientePrueba = `cliente-e2e-cu04-${timestamp}@example.com`;
  const nombreProyectoConCronograma = `Proyecto con cronograma e2e-cu04 ${timestamp}`;
  const nombreProyectoSinCronograma = `Proyecto sin cronograma e2e-cu04 ${timestamp}`;
  const nombreCronogramaPrueba = `Cronograma e2e-cu04 ${timestamp}`;
  const nombreTareaPrueba = `Tarea obra bruta e2e-cu04 ${timestamp}`;

  const cleanupTestData = async () => {
    const clientesPrueba = await prismaService.cliente.findMany({
      where: {
        correo: {
          contains: 'e2e-cu04',
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

    await cleanupTestData();

    const clientePrueba = await prismaService.cliente.create({
      data: {
        nombre: 'Cliente E2E CU04',
        direccion: 'Av. Tareas Brutas 123',
        telefono: `73${timestamp.toString().slice(-6)}`,
        correo: correoClientePrueba,
        tipoCliente: 'EMPRESA',
      },
    });

    clientePruebaId = clientePrueba.idCliente;

    const proyectoConCronograma = await prismaService.proyecto.create({
      data: {
        idCliente: clientePruebaId,
        nombre: nombreProyectoConCronograma,
        descripcion: 'Proyecto con cronograma E2E CU04',
        ubicacion: 'La Paz',
        presupuesto: 250000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-09-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Specs CU04',
      },
    });

    proyectoConCronogramaId = proyectoConCronograma.idProyecto;

    const proyectoSinCronograma = await prismaService.proyecto.create({
      data: {
        idCliente: clientePruebaId,
        nombre: nombreProyectoSinCronograma,
        descripcion: 'Proyecto sin cronograma E2E CU04',
        ubicacion: 'La Paz',
        presupuesto: 230000,
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

  it('ejecuta el flujo principal de CU04', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/cu04/tareas-obra-bruta')
      .send({
        idProyecto: proyectoConCronogramaId,
        nombre: nombreTareaPrueba,
        descripcion: 'Levantado de muros estructurales',
        perfilRequerido: OcupacionTrabajador.ALBANIL,
        duracionEstimada: 5,
        fechaInicioPlanificada: '2026-05-10T00:00:00.000Z',
        fechaFinPlanificada: '2026-05-15T00:00:00.000Z',
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
        tipoTarea: TipoTarea.OBRA_BRUTA,
        estadoTarea: 'PENDIENTE',
      }),
    });

    const createResponseBody = getSuccessBody<{ idTarea: number }>(
      createResponse,
    );

    tareaCreadaId = createResponseBody.data.idTarea;

    await request(app.getHttpServer())
      .post('/cu04/tareas-obra-bruta')
      .send({
        idProyecto: proyectoSinCronogramaId,
        nombre: `${nombreTareaPrueba} Sin Cronograma`,
        descripcion: 'No debe crearse',
        perfilRequerido: OcupacionTrabajador.PLOMERO,
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
          path: '/cu04/tareas-obra-bruta',
          message: `No se encontro un cronograma para el proyecto con id ${proyectoSinCronogramaId}.`,
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .post('/cu04/tareas-obra-bruta')
      .send({
        idProyecto: proyectoConCronogramaId,
        nombre: `${nombreTareaPrueba} Fechas Invalidas`,
        descripcion: 'No debe crearse',
        perfilRequerido: OcupacionTrabajador.PLOMERO,
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
          path: '/cu04/tareas-obra-bruta',
          message:
            'La fecha fin planificada no puede ser anterior a la fecha inicio planificada.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .post('/cu04/tareas-obra-bruta')
      .send({
        idProyecto: proyectoConCronogramaId,
        nombre: `${nombreTareaPrueba} Perfil Invalido`,
        descripcion: 'No debe crearse',
        perfilRequerido: OcupacionTrabajador.CARPINTERO,
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
          path: '/cu04/tareas-obra-bruta',
          message:
            'El perfil requerido para tareas de obra bruta debe ser ALBANIL, PLOMERO o ELECTRICISTA.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .get('/cu04/tareas-obra-bruta')
      .query({
        idProyecto: proyectoConCronogramaId,
        busqueda: 'Tarea obra bruta e2e-cu04',
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

    await request(app.getHttpServer())
      .patch(`/cu04/tareas-obra-bruta/${tareaCreadaId}`)
      .send({
        nombre: `${nombreTareaPrueba} Actualizada`,
        perfilRequerido: OcupacionTrabajador.ELECTRICISTA,
        fechaFinPlanificada: '2026-05-16T00:00:00.000Z',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idTarea: tareaCreadaId,
            nombre: `${nombreTareaPrueba} Actualizada`,
            perfilRequerido: OcupacionTrabajador.ELECTRICISTA,
            tipoTarea: TipoTarea.OBRA_BRUTA,
          }),
        });
      });

    await request(app.getHttpServer())
      .delete(`/cu04/tareas-obra-bruta/${tareaCreadaId}`)
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
