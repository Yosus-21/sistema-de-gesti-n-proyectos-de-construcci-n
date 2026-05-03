import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RolUsuario as PrismaRolUsuario } from '@prisma/client';
import request, { Test } from 'supertest';
import { App } from 'supertest/types';
import { PrismaService } from '../../src/infrastructure';
import { getSuccessBody } from './e2e-response.types';

interface LoginSuccessResponse {
  accessToken: string;
}

type E2EUserRole =
  | 'ADMIN'
  | 'GESTOR_PROYECTO'
  | 'INGENIERO'
  | 'ENCARGADO_COMPRAS'
  | 'CONTRATISTA'
  | 'LECTOR';

export interface AuthHeader {
  Authorization: string;
}

export interface AuthorizedRequest {
  delete: (url: string) => Test;
  get: (url: string) => Test;
  patch: (url: string) => Test;
  post: (url: string) => Test;
  put: (url: string) => Test;
}

const E2E_AUTH_PASSWORD = 'Password123';

export function createAuthorizedRequest(
  app: INestApplication<App>,
  headers: AuthHeader,
): AuthorizedRequest {
  return {
    get: (url) => request(app.getHttpServer()).get(url).set(headers),
    post: (url) => request(app.getHttpServer()).post(url).set(headers),
    patch: (url) => request(app.getHttpServer()).patch(url).set(headers),
    delete: (url) => request(app.getHttpServer()).delete(url).set(headers),
    put: (url) => request(app.getHttpServer()).put(url).set(headers),
  };
}

export async function getAdminAuthHeaders(
  app: INestApplication<App>,
  prisma: PrismaService,
  prefix: string,
): Promise<AuthHeader> {
  return getRoleAuthHeaders(app, prisma, prefix, PrismaRolUsuario.ADMIN);
}

export async function getRoleAuthHeaders(
  app: INestApplication<App>,
  prisma: PrismaService,
  prefix: string,
  role: E2EUserRole,
): Promise<AuthHeader> {
  const normalizedPrefix = prefix.toLowerCase();
  const correo = `${normalizedPrefix}-${role.toLowerCase()}@example.com`;
  const prismaRole = PrismaRolUsuario[role];

  await prisma.usuario.deleteMany({
    where: {
      correo: {
        contains: normalizedPrefix,
      },
    },
  });

  await prisma.usuario.create({
    data: {
      nombre: `Usuario ${role} ${prefix}`,
      correo,
      passwordHash: await bcrypt.hash(E2E_AUTH_PASSWORD, 10),
      rol: prismaRole,
      activo: true,
    },
  });

  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      correo,
      password: E2E_AUTH_PASSWORD,
    })
    .expect(200);

  const loginBody = getSuccessBody<LoginSuccessResponse>(loginResponse);

  return {
    Authorization: `Bearer ${loginBody.data.accessToken}`,
  };
}
