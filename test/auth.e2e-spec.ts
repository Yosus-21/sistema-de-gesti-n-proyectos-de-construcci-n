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
  getErrorBody,
  getSuccessBody,
} from './helpers/e2e-response.types';

interface RegisterResponse {
  idUsuario: number;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
}

interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: RegisterResponse;
}

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  const originalAuthRegisterEnabled = process.env.AUTH_REGISTER_ENABLED;

  const testEmail = `e2e-auth-${Date.now()}@example.com`;
  const registerPayload = {
    nombre: 'Usuario E2E Auth',
    correo: testEmail,
    password: 'Password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    prismaService = app.get(PrismaService);
    process.env.AUTH_REGISTER_ENABLED = 'true';

    await prismaService.usuario.deleteMany({
      where: {
        correo: {
          contains: 'e2e-auth',
        },
      },
    });
  });

  afterAll(async () => {
    if (originalAuthRegisterEnabled === undefined) {
      delete process.env.AUTH_REGISTER_ENABLED;
    } else {
      process.env.AUTH_REGISTER_ENABLED = originalAuthRegisterEnabled;
    }

    await prismaService?.usuario.deleteMany({
      where: {
        correo: {
          contains: 'e2e-auth',
        },
      },
    });

    await app?.close();
  });

  it('ejecuta el flujo base de autenticación JWT', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerPayload)
      .expect(201);

    expect(registerResponse.body).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: {
        idUsuario: expectAnyNumber(),
        nombre: registerPayload.nombre,
        correo: registerPayload.correo,
        rol: 'ADMIN',
        activo: true,
      },
    });

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerPayload)
      .expect(409)
      .expect((response) => {
        const body = getErrorBody(response);
        expect(body).toEqual({
          success: false,
          statusCode: 409,
          timestamp: expectAnyString(),
          path: '/auth/register',
          message: 'Ya existe un usuario registrado con el mismo correo.',
          errors: [],
        });
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        correo: registerPayload.correo,
        password: registerPayload.password,
      })
      .expect(200);

    const loginBody = getSuccessBody<LoginResponse>(loginResponse);
    expect(loginBody.success).toBe(true);
    expect(loginBody.timestamp).toEqual(expectAnyString());
    expect(loginBody.data.accessToken).toEqual(expectAnyString());
    expect(loginBody.data.tokenType).toBe('Bearer');
    expect(loginBody.data.user.correo).toBe(registerPayload.correo);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        correo: registerPayload.correo,
        password: 'PasswordIncorrecto',
      })
      .expect(401)
      .expect((response) => {
        const body = getErrorBody(response);
        expect(body).toEqual({
          success: false,
          statusCode: 401,
          timestamp: expectAnyString(),
          path: '/auth/login',
          message: 'Credenciales inválidas.',
          errors: [],
        });
      });

    await request(app.getHttpServer())
      .get('/auth/me')
      .expect(401)
      .expect((response) => {
        const body = getErrorBody(response);
        expect(body).toEqual({
          success: false,
          statusCode: 401,
          timestamp: expectAnyString(),
          path: '/auth/me',
          message: 'Unauthorized',
          errors: [],
        });
      });

    const meResponse = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginBody.data.accessToken}`)
      .expect(200);

    const meBody = getSuccessBody<RegisterResponse>(meResponse);
    expect(meBody).toEqual({
      success: true,
      timestamp: expectAnyString(),
      data: {
        idUsuario: expectAnyNumber(),
        nombre: registerPayload.nombre,
        correo: registerPayload.correo,
        rol: 'ADMIN',
        activo: true,
      },
    });
  });
});
