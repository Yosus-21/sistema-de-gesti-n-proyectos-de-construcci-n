import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { HttpExceptionFilter } from '../filters';
import { ResponseInterceptor } from '../interceptors';
import { parseBooleanEnv, parseCsvEnv } from './env.util';
import { configureSwagger } from './swagger.util';

export function configureApp(app: INestApplication): void {
  const corsEnabled = parseBooleanEnv(process.env.CORS_ENABLED);
  const corsOrigins = parseCsvEnv(process.env.CORS_ORIGIN);
  const corsMethods = parseCsvEnv(process.env.CORS_METHODS);

  if (corsEnabled) {
    const origin = corsOrigins.includes('*')
      ? true
      : corsOrigins.length === 1
        ? corsOrigins[0]
        : corsOrigins.length > 1
          ? corsOrigins
          : false;

    app.enableCors({
      origin,
      methods: corsMethods.length > 0 ? corsMethods : undefined,
      credentials: parseBooleanEnv(process.env.CORS_CREDENTIALS),
    });
  }

  app.use(
    helmet({
      // Swagger UI requiere una politica mas flexible hasta definir CSP dedicada.
      contentSecurityPolicy: false,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  configureSwagger(app);
}
