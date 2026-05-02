import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import { EstadoProyecto } from './../src/domain';
import { PrismaService } from './../src/infrastructure';
import {
  expectAnyNumber,
  expectAnyString,
  expectObjectContaining,
  getSuccessBody,
} from './helpers/e2e-response.types';

describe('CU02 Creacion de Proyectos (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let clientePruebaId: number;
  let proyectoCreadoId: number | undefined;

  const timestamp = Date.now();
  const correoClientePrueba = `cliente-e2e-cu02-${timestamp}@example.com`;
  const nombreProyectoPrueba = `Proyecto E2E CU02 ${timestamp}`;

  const cleanupTestData = async () => {
    const clientesPrueba = await prismaService.cliente.findMany({
      where: {
        correo: {
          contains: 'e2e-cu02',
        },
      },
      select: {
        idCliente: true,
      },
    });

    const clientesIds = clientesPrueba.map((cliente) => cliente.idCliente);

    if (clientesIds.length > 0) {
      await prismaService.proyecto.deleteMany({
        where: {
          idCliente: {
            in: clientesIds,
          },
        },
      });

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
        nombre: 'Cliente E2E CU02',
        direccion: 'Av. Proyecto 123',
        telefono: `76${timestamp.toString().slice(-6)}`,
        correo: correoClientePrueba,
        tipoCliente: 'EMPRESA',
      },
    });

    clientePruebaId = clientePrueba.idCliente;
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo principal de CU02', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/cu02/proyectos')
      .send({
        idCliente: clientePruebaId,
        nombre: nombreProyectoPrueba,
        descripcion: 'Proyecto de prueba E2E CU02',
        ubicacion: 'La Paz',
        presupuesto: 250000,
        fechaInicio: '2026-05-01T00:00:00.000Z',
        fechaFinEstimada: '2026-07-01T00:00:00.000Z',
        especificacionesTecnicas: 'Especificaciones tecnicas E2E CU02',
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idProyecto: expectAnyNumber(),
        idCliente: clientePruebaId,
        nombre: nombreProyectoPrueba,
        estadoProyecto: EstadoProyecto.PLANIFICACION,
      }),
    });

    const createResponseBody = getSuccessBody<{ idProyecto: number }>(
      createResponse,
    );

    proyectoCreadoId = createResponseBody.data.idProyecto;

    await request(app.getHttpServer())
      .post('/cu02/proyectos')
      .send({
        idCliente: 999999,
        nombre: `${nombreProyectoPrueba} Invalido`,
        descripcion: 'Proyecto con cliente inexistente',
        ubicacion: 'La Paz',
        presupuesto: 1000,
        fechaInicio: '2026-05-01T00:00:00.000Z',
        fechaFinEstimada: '2026-06-01T00:00:00.000Z',
        especificacionesTecnicas: 'Specs',
      })
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu02/proyectos',
          message: 'No se encontro el cliente con id 999999.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .post('/cu02/proyectos')
      .send({
        idCliente: clientePruebaId,
        nombre: `${nombreProyectoPrueba} Fechas Invalidas`,
        descripcion: 'Proyecto con fechas invalidas',
        ubicacion: 'La Paz',
        presupuesto: 1000,
        fechaInicio: '2026-08-01T00:00:00.000Z',
        fechaFinEstimada: '2026-06-01T00:00:00.000Z',
        especificacionesTecnicas: 'Specs',
      })
      .expect(400)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 400,
          timestamp: expectAnyString(),
          path: '/cu02/proyectos',
          message:
            'La fecha fin estimada no puede ser anterior a la fecha de inicio.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .get('/cu02/proyectos')
      .query({
        idCliente: clientePruebaId,
        busqueda: 'Proyecto E2E CU02',
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<Array<{ idProyecto: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (proyecto: { idProyecto: number }) =>
              proyecto.idProyecto === proyectoCreadoId,
          ),
        ).toBe(true);
      });

    await request(app.getHttpServer())
      .get(`/cu02/proyectos/${proyectoCreadoId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idProyecto: proyectoCreadoId,
            estadoProyecto: EstadoProyecto.PLANIFICACION,
          }),
        });
      });

    await request(app.getHttpServer())
      .patch(`/cu02/proyectos/${proyectoCreadoId}/estado`)
      .send({
        estadoProyecto: EstadoProyecto.EN_EJECUCION,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idProyecto: proyectoCreadoId,
            estadoProyecto: EstadoProyecto.EN_EJECUCION,
          }),
        });
      });

    await request(app.getHttpServer())
      .get('/cu02/proyectos/99999999')
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: '/cu02/proyectos/99999999',
          message: 'No se encontro el proyecto con id 99999999.',
          errors: [],
        });
      });
  });
});
