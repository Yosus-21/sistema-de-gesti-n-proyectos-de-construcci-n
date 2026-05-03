import { INestApplication } from '@nestjs/common';
import { RolUsuario as PrismaRolUsuario } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import { PrismaService } from './../src/infrastructure';
import {
  createAuthorizedRequest,
  getAdminAuthHeaders,
  getRoleAuthHeaders,
} from './helpers/auth-e2e.helper';
import {
  expectAnyNumber,
  expectAnyString,
  getErrorBody,
  getSuccessBody,
} from './helpers/e2e-response.types';

interface LoginResponse {
  accessToken: string;
}

interface HealthResponse {
  status: string;
}

interface ClienteResponse {
  idCliente: number;
  nombre: string;
  correo: string;
}

describe('RBAC (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let adminHeaders: { Authorization: string };
  let contractorHeaders: { Authorization: string };
  let lectorHeaders: { Authorization: string };

  const originalAuthRegisterEnabled = process.env.AUTH_REGISTER_ENABLED;
  const registerPayload = {
    nombre: 'Usuario E2E RBAC Public',
    correo: `e2e-rbac-public-${Date.now()}@example.com`,
    password: 'Password123',
  };
  const blockedRegisterPayload = {
    nombre: 'Usuario E2E RBAC Blocked',
    correo: `e2e-rbac-blocked-${Date.now()}@example.com`,
    password: 'Password123',
  };
  const adminClientePayload = {
    nombre: 'Cliente RBAC Admin',
    direccion: 'Zona RBAC 123',
    telefono: '70000001',
    correo: `e2e-rbac-cliente-${Date.now()}@example.com`,
    tipoCliente: 'EMPRESA',
  };

  const cleanupUsers = async () => {
    await prismaService.usuario.deleteMany({
      where: {
        correo: {
          contains: 'e2e-rbac',
        },
      },
    });
  };

  const cleanupClientes = async () => {
    await prismaService.cliente.deleteMany({
      where: {
        correo: {
          contains: 'e2e-rbac',
        },
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
    process.env.AUTH_REGISTER_ENABLED = 'true';

    await cleanupUsers();
    await cleanupClientes();

    adminHeaders = await getAdminAuthHeaders(
      app,
      prismaService,
      'e2e-rbac-admin',
    );
    contractorHeaders = await getRoleAuthHeaders(
      app,
      prismaService,
      'e2e-rbac-contractor',
      PrismaRolUsuario.CONTRATISTA,
    );
    lectorHeaders = await getRoleAuthHeaders(
      app,
      prismaService,
      'e2e-rbac-lector',
      PrismaRolUsuario.LECTOR,
    );
  });

  afterEach(() => {
    process.env.AUTH_REGISTER_ENABLED = 'true';
  });

  afterAll(async () => {
    if (originalAuthRegisterEnabled === undefined) {
      delete process.env.AUTH_REGISTER_ENABLED;
    } else {
      process.env.AUTH_REGISTER_ENABLED = originalAuthRegisterEnabled;
    }

    await cleanupClientes();
    await cleanupUsers();
    await app?.close();
  });

  it('/auth/register permanece público cuando AUTH_REGISTER_ENABLED=true', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerPayload)
      .expect(201)
      .expect((response) => {
        const body = getSuccessBody<{
          idUsuario: number;
          correo: string;
          rol: string;
        }>(response);

        expect(body.success).toBe(true);
        expect(body.timestamp).toEqual(expectAnyString());
        expect(body.data.idUsuario).toEqual(expectAnyNumber());
        expect(body.data.correo).toBe(registerPayload.correo);
        expect(body.data.rol).toBe('ADMIN');
      });
  });

  it('/auth/register se bloquea cuando AUTH_REGISTER_ENABLED=false', async () => {
    process.env.AUTH_REGISTER_ENABLED = 'false';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(blockedRegisterPayload)
      .expect(403)
      .expect((response) => {
        const body = getErrorBody(response);
        expect(body).toEqual({
          success: false,
          statusCode: 403,
          timestamp: expectAnyString(),
          path: '/auth/register',
          message: 'El registro público de usuarios está deshabilitado.',
          errors: [],
        });
      });
  });

  it('/auth/login sigue público', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        correo: registerPayload.correo,
        password: registerPayload.password,
      })
      .expect(200);

    const body = getSuccessBody<LoginResponse>(loginResponse);
    expect(body.data.accessToken).toEqual(expectAnyString());
  });

  it('expone /health sin token para monitoreo', async () => {
    await request(app.getHttpServer())
      .get('/cu01/clientes/health')
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<HealthResponse>(response);
        expect(body.success).toBe(true);
        expect(body.data.status).toBe('ok');
      });
  });

  it('mantiene JWT obligatorio en endpoints protegidos', async () => {
    await request(app.getHttpServer())
      .get('/cu01/clientes')
      .expect(401)
      .expect((response) => {
        const body = getErrorBody(response);
        expect(body).toEqual({
          success: false,
          statusCode: 401,
          timestamp: expectAnyString(),
          path: '/cu01/clientes',
          message: 'Unauthorized',
          errors: [],
        });
      });
  });

  it('permite a LECTOR consultar endpoints GET autorizados', async () => {
    const lectorApi = createAuthorizedRequest(app, lectorHeaders);

    await lectorApi
      .get('/cu01/clientes')
      .expect(200)
      .expect((response) => {
        const body = getSuccessBody<ClienteResponse[]>(response);
        expect(body.success).toBe(true);
        expect(Array.isArray(body.data)).toBe(true);
      });
  });

  it('bloquea a LECTOR en operaciones de escritura', async () => {
    const lectorApi = createAuthorizedRequest(app, lectorHeaders);

    await lectorApi
      .post('/cu01/clientes')
      .send(adminClientePayload)
      .expect(403)
      .expect((response) => {
        const body = getErrorBody(response);
        expect(body).toEqual({
          success: false,
          statusCode: 403,
          timestamp: expectAnyString(),
          path: '/cu01/clientes',
          message: 'No tiene permisos para acceder a este recurso.',
          errors: [],
        });
      });
  });

  it('permite a ADMIN ejecutar operaciones protegidas de escritura', async () => {
    const adminApi = createAuthorizedRequest(app, adminHeaders);

    await adminApi
      .post('/cu01/clientes')
      .send(adminClientePayload)
      .expect(201)
      .expect((response) => {
        const body = getSuccessBody<ClienteResponse>(response);
        expect(body.success).toBe(true);
        expect(body.data.idCliente).toEqual(expectAnyNumber());
        expect(body.data.correo).toBe(adminClientePayload.correo);
      });
  });

  it('devuelve 403 cuando el rol autenticado no tiene acceso al módulo', async () => {
    const contractorApi = createAuthorizedRequest(app, contractorHeaders);

    await contractorApi
      .get('/cu12/materiales')
      .expect(403)
      .expect((response) => {
        const body = getErrorBody(response);
        expect(body).toEqual({
          success: false,
          statusCode: 403,
          timestamp: expectAnyString(),
          path: '/cu12/materiales',
          message: 'No tiene permisos para acceder a este recurso.',
          errors: [],
        });
      });
  });
});
