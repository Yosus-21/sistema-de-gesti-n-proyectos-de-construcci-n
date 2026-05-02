import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import { OcupacionTrabajador } from './../src/domain';
import { PrismaService } from './../src/infrastructure';
import {
  expectAnyNumber,
  expectAnyString,
  expectObjectContaining,
  getSuccessBody,
  getErrorBody,
} from './helpers/e2e-response.types';

describe('CU08 Gestion de Trabajador (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let trabajadorCreadoId: number | undefined;

  const timestamp = Date.now();
  const correoPrueba = `trabajador-e2e-cu08-${timestamp}@example.com`;
  const correoActualizado = `trabajador-actualizado-e2e-cu08-${timestamp}@example.com`;
  const ciPrueba = `E2E-CU08-${timestamp}`;

  const cleanupTestData = async () => {
    await prismaService.trabajador.deleteMany({
      where: {
        OR: [
          {
            correo: {
              contains: 'e2e-cu08',
            },
          },
          {
            ci: {
              contains: 'E2E-CU08',
            },
          },
        ],
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
  });

  afterAll(async () => {
    await cleanupTestData();
    await app?.close();
  });

  it('ejecuta el flujo completo de CU08', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/cu08/trabajadores')
      .send({
        nombre: 'Trabajador E2E CU08',
        ci: ciPrueba,
        telefono: '76543210',
        correo: correoPrueba,
        licenciaProfesional: 'LP-CU08',
        aniosExperiencia: 7,
        especializaciones: 'Instalaciones electricas',
        certificaciones: 'Altura',
        ocupacion: OcupacionTrabajador.ELECTRICISTA,
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idTrabajador: expectAnyNumber(),
        nombre: 'Trabajador E2E CU08',
        ci: ciPrueba,
        correo: correoPrueba,
        ocupacion: OcupacionTrabajador.ELECTRICISTA,
      }),
    });

    const createResponseBody = getSuccessBody<{ idTrabajador: number }>(
      createResponse,
    );

    trabajadorCreadoId = createResponseBody.data.idTrabajador;

    await request(app.getHttpServer())
      .post('/cu08/trabajadores')
      .send({
        nombre: 'Trabajador E2E CU08 Duplicado',
        ci: ciPrueba,
        telefono: '70000001',
        correo: correoPrueba,
        aniosExperiencia: 3,
        ocupacion: OcupacionTrabajador.ELECTRICISTA,
      })
      .expect(409)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 409,
          timestamp: expectAnyString(),
          path: '/cu08/trabajadores',
          message:
            'Ya existe un trabajador registrado con el mismo CI o correo.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .get('/cu08/trabajadores')
      .query({
        ocupacion: OcupacionTrabajador.ELECTRICISTA,
        busqueda: 'e2e-cu08',
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<Array<{ idTrabajador: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (trabajador: { idTrabajador: number }) =>
              trabajador.idTrabajador === trabajadorCreadoId,
          ),
        ).toBe(true);
      });

    await request(app.getHttpServer())
      .get(`/cu08/trabajadores/${trabajadorCreadoId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idTrabajador: trabajadorCreadoId,
            ci: ciPrueba,
            correo: correoPrueba,
          }),
        });
      });

    await request(app.getHttpServer())
      .patch(`/cu08/trabajadores/${trabajadorCreadoId}`)
      .send({
        nombre: 'Trabajador E2E CU08 Actualizado',
        correo: correoActualizado,
        ocupacion: OcupacionTrabajador.ALBANIL,
        especializaciones: 'Albanileria general',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idTrabajador: trabajadorCreadoId,
            nombre: 'Trabajador E2E CU08 Actualizado',
            correo: correoActualizado,
            ocupacion: OcupacionTrabajador.ALBANIL,
            especializaciones: 'Albanileria general',
          }),
        });
      });

    await request(app.getHttpServer())
      .get(`/cu08/trabajadores/${trabajadorCreadoId}/disponibilidad`)
      .query({
        fechaInicio: '2026-05-10',
        fechaFin: '2026-05-15',
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            idTrabajador: trabajadorCreadoId,
            disponible: true,
            motivo:
              'Disponibilidad provisional: las asignaciones se validarán cuando se implemente CU09-CU11.',
          },
        });
      });

    await request(app.getHttpServer())
      .get(`/cu08/trabajadores/${trabajadorCreadoId}/disponibilidad`)
      .query({
        fechaInicio: '2026-05-20',
        fechaFin: '2026-05-10',
      })
      .expect(400)
      .expect((response) => {
        const body = getErrorBody(response);
        expect(body.success).toBe(false);
        expect(body.statusCode).toBe(400);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(body.path).toContain(
          `/cu08/trabajadores/${trabajadorCreadoId}/disponibilidad`,
        );
        expect(body.message).toBe(
          'La fecha de fin no puede ser anterior a la fecha de inicio.',
        );
      });

    await request(app.getHttpServer())
      .delete(`/cu08/trabajadores/${trabajadorCreadoId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            eliminado: true,
            idTrabajador: trabajadorCreadoId,
          },
        });
      });

    await request(app.getHttpServer())
      .get(`/cu08/trabajadores/${trabajadorCreadoId}`)
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: `/cu08/trabajadores/${trabajadorCreadoId}`,
          message: `No se encontro el trabajador con id ${trabajadorCreadoId}.`,
          errors: [],
        });
      });
  });
});
