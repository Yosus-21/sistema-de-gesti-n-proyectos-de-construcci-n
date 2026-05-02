import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from './../src/common';
import { PrismaService } from './../src/infrastructure';
import { expectAnyString } from './helpers/e2e-response.types';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const prismaServiceMock = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    onModuleInit: jest.fn(),
    onModuleDestroy: jest.fn(),
  };

  jest.setTimeout(30000);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          success: true,
          timestamp: expectAnyString(),
          data: 'Hello World!',
        });
      });
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app?.close();
  });
});
