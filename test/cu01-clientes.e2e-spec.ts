import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import { PrismaService } from './../src/infrastructure';
import {
  expectAnyNumber,
  expectAnyString,
  expectObjectContaining,
  getSuccessBody,
} from './helpers/e2e-response.types';

describe('CU01 Gestionar Clientes (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let createdClientId: number | undefined;

  const testEmail = `cliente-e2e-cu01-${Date.now()}@example.com`;
  const updatedEmail = `cliente-actualizado-e2e-cu01-${Date.now()}@example.com`;
  const testPhone = `78${Date.now().toString().slice(-6)}`;
  const updatedPhone = `79${Date.now().toString().slice(-6)}`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    prismaService = app.get(PrismaService);

    await prismaService.cliente.deleteMany({
      where: {
        correo: {
          contains: 'e2e-cu01',
        },
      },
    });
  });

  afterAll(async () => {
    await prismaService?.cliente.deleteMany({
      where: {
        correo: {
          contains: 'e2e-cu01',
        },
      },
    });

    await app?.close();
  });

  it('ejecuta el flujo completo de CU01', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/cu01/clientes')
      .send({
        nombre: 'Cliente E2E CU01',
        direccion: 'Av. Principal 123',
        telefono: testPhone,
        correo: testEmail,
        tipoCliente: 'EMPRESA',
      })
      .expect(201);

    expect(createResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: expectObjectContaining({
        idCliente: expectAnyNumber(),
        nombre: 'Cliente E2E CU01',
        direccion: 'Av. Principal 123',
        telefono: testPhone,
        correo: testEmail,
        tipoCliente: 'EMPRESA',
      }),
    });

    const createResponseBody = getSuccessBody<{ idCliente: number }>(
      createResponse,
    );

    createdClientId = createResponseBody.data.idCliente;

    await request(app.getHttpServer())
      .post('/cu01/clientes')
      .send({
        nombre: 'Cliente E2E CU01 Duplicado',
        direccion: 'Av. Principal 999',
        telefono: testPhone,
        correo: testEmail,
        tipoCliente: 'EMPRESA',
      })
      .expect(409)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 409,
          timestamp: expectAnyString(),
          path: '/cu01/clientes',
          message:
            'Ya existe un cliente registrado con el mismo correo o telefono.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .get('/cu01/clientes')
      .query({
        busqueda: 'E2E CU01',
        pagina: 1,
        limite: 10,
      })
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<Array<{ idCliente: number }>>(response);
        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(Array.isArray(body.data)).toBe(true);
        expect(
          body.data.some(
            (cliente: { idCliente: number }) =>
              cliente.idCliente === createdClientId,
          ),
        ).toBe(true);
      });

    await request(app.getHttpServer())
      .get(`/cu01/clientes/${createdClientId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idCliente: createdClientId,
            correo: testEmail,
          }),
        });
      });

    await request(app.getHttpServer())
      .patch(`/cu01/clientes/${createdClientId}`)
      .send({
        nombre: 'Cliente E2E CU01 Actualizado',
        correo: updatedEmail,
        telefono: updatedPhone,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: expectObjectContaining({
            idCliente: createdClientId,
            nombre: 'Cliente E2E CU01 Actualizado',
            correo: updatedEmail,
            telefono: updatedPhone,
          }),
        });
      });

    await request(app.getHttpServer())
      .delete(`/cu01/clientes/${createdClientId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: {
            eliminado: true,
            idCliente: createdClientId,
          },
        });
      });

    await request(app.getHttpServer())
      .get(`/cu01/clientes/${createdClientId}`)
      .expect(404)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: false,
          statusCode: 404,
          timestamp: expectAnyString(),
          path: `/cu01/clientes/${createdClientId}`,
          message: `No se encontro el cliente con id ${createdClientId}.`,
          errors: [],
        });
      });
  });
});
