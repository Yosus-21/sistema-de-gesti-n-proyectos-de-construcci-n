import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import { EstadoCronograma, EstadoProyecto } from './../src/domain';
import { PrismaService } from './../src/infrastructure';
import {
  expectAnyNumber,
  expectAnyString,
  expectObjectContaining,
  getSuccessBody,
} from './helpers/e2e-response.types';

describe('CU05 Creacion de Cronograma (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let clientePruebaId: number;
  let proyectoPruebaId: number;
  let cronogramaCreadoId: number | undefined;

  const timestamp = Date.now();
  const correoClientePrueba = `cliente-e2e-cu05-${timestamp}@example.com`;
  const nombreProyectoPrueba = `Proyecto e2e-cu05 ${timestamp}`;
  const nombreCronogramaPrueba = `Cronograma e2e-cu05 ${timestamp}`;

  const cleanupTestData = async () => {
    const clientesPrueba = await prismaService.cliente.findMany({
      where: {
        correo: {
          contains: 'e2e-cu05',
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
        await prismaService.cronograma.deleteMany({
          where: {
            idProyecto: {
              in: proyectosIds,
            },
          },
        });

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
        nombre: 'Cliente E2E CU05',
        direccion: 'Av. Cronograma 123',
        telefono: `75${timestamp.toString().slice(-6)}`,
        correo: correoClientePrueba,
        tipoCliente: 'EMPRESA',
      },
    });

    clientePruebaId = clientePrueba.idCliente;

    const proyectoPrueba = await prismaService.proyecto.create({
      data: {
        idCliente: clientePruebaId,
        nombre: nombreProyectoPrueba,
        descripcion: 'Proyecto de prueba E2E CU05',
        ubicacion: 'La Paz',
        presupuesto: 300000,
        fechaInicio: new Date('2026-05-01T00:00:00.000Z'),
        fechaFinEstimada: new Date('2026-09-01T00:00:00.000Z'),
        estadoProyecto: EstadoProyecto.PLANIFICACION,
        especificacionesTecnicas: 'Especificaciones tecnicas E2E CU05',
      },
    });

    proyectoPruebaId = proyectoPrueba.idProyecto;
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo principal de CU05', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/cu05/cronogramas')
      .send({
        idProyecto: proyectoPruebaId,
        nombre: nombreCronogramaPrueba,
        estadoInicial: EstadoCronograma.PLANIFICADO,
        accionesAnteRetraso: 'Monitorear hitos',
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idCronograma: expectAnyNumber(),
        idProyecto: proyectoPruebaId,
        nombre: nombreCronogramaPrueba,
        estadoCronograma: EstadoCronograma.PLANIFICADO,
        accionesAnteRetraso: 'Monitorear hitos',
      }),
    });

    const createResponseBody = getSuccessBody<{ idCronograma: number }>(
      createResponse,
    );

    cronogramaCreadoId = createResponseBody.data.idCronograma;

    await request(app.getHttpServer())
      .post('/cu05/cronogramas')
      .send({
        idProyecto: 999999,
        nombre: `${nombreCronogramaPrueba} Invalido`,
        estadoInicial: EstadoCronograma.PLANIFICADO,
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu05/cronogramas',
          message: 'No se encontro el proyecto con id 999999.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .post('/cu05/cronogramas')
      .send({
        idProyecto: proyectoPruebaId,
        nombre: `${nombreCronogramaPrueba} Duplicado`,
        estadoInicial: EstadoCronograma.PLANIFICADO,
      })
      .expect(409)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 409,
          timestamp: expectAnyString(),
          path: '/cu05/cronogramas',
          message: 'El proyecto ya tiene un cronograma registrado.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .get('/cu05/cronogramas')
      .query({
        idProyecto: proyectoPruebaId,
        busqueda: 'Cronograma e2e-cu05',
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<Array<{ idCronograma: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (cronograma: { idCronograma: number }) =>
              cronograma.idCronograma === cronogramaCreadoId,
          ),
        ).toBe(true);
      });

    await request(app.getHttpServer())
      .get(`/cu05/cronogramas/${cronogramaCreadoId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idCronograma: cronogramaCreadoId,
            idProyecto: proyectoPruebaId,
            estadoCronograma: EstadoCronograma.PLANIFICADO,
          }),
        });
      });

    await request(app.getHttpServer())
      .patch(`/cu05/cronogramas/${cronogramaCreadoId}/replanificar`)
      .send({
        motivoReplanificacion: 'Ajuste por cambio de alcance',
        nuevasAccionesAnteRetraso: 'Reprogramar hitos dependientes',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idCronograma: cronogramaCreadoId,
            estadoCronograma: EstadoCronograma.REPLANIFICADO,
            motivoReplanificacion: 'Ajuste por cambio de alcance',
            accionesAnteRetraso: 'Reprogramar hitos dependientes',
            fechaUltimaModificacion: expectAnyString(),
          }),
        });
      });

    await request(app.getHttpServer())
      .get('/cu05/cronogramas/99999999')
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu05/cronogramas/99999999',
          message: 'No se encontro el cronograma con id 99999999.',
          errors: [],
        });
      });
  });
});
