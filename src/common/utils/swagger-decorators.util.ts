import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiErrorResponseDto, ApiSuccessResponseDto } from '../dto';

type ErrorKind = 'badRequest' | 'notFound' | 'conflict';

export function ApiEnvelopeOk(description: string) {
  return ApiOkResponse({
    description,
    type: ApiSuccessResponseDto,
  });
}

export function ApiEnvelopeCreated(description: string) {
  return ApiCreatedResponse({
    description,
    type: ApiSuccessResponseDto,
  });
}

export function ApiStandardErrorResponses(...kinds: ErrorKind[]) {
  const decorators = kinds.map((kind) => {
    switch (kind) {
      case 'badRequest':
        return ApiBadRequestResponse({
          description: 'La solicitud no cumple las reglas de validación.',
          type: ApiErrorResponseDto,
        });
      case 'notFound':
        return ApiNotFoundResponse({
          description: 'El recurso solicitado no existe.',
          type: ApiErrorResponseDto,
        });
      case 'conflict':
        return ApiConflictResponse({
          description: 'La operación entra en conflicto con el estado actual.',
          type: ApiErrorResponseDto,
        });
    }
  });

  return applyDecorators(...decorators);
}

export function ApiProtectedResource() {
  return applyDecorators(
    ApiBearerAuth('access-token'),
    ApiUnauthorizedResponse({
      description: 'Token Bearer inválido o ausente.',
      type: ApiErrorResponseDto,
    }),
    ApiForbiddenResponse({
      description: 'El rol autenticado no tiene acceso a este recurso.',
      type: ApiErrorResponseDto,
    }),
  );
}

export function ApiNumericParam(name: string, description: string) {
  return ApiParam({
    name,
    type: Number,
    example: 1,
    description,
  });
}

export function ApiPaginationQueries() {
  return applyDecorators(
    ApiQuery({
      name: 'pagina',
      required: false,
      type: Number,
      example: 1,
      description: 'Número de página para paginación.',
    }),
    ApiQuery({
      name: 'limite',
      required: false,
      type: Number,
      example: 10,
      description: 'Cantidad máxima de registros por página.',
    }),
    ApiQuery({
      name: 'busqueda',
      required: false,
      type: String,
      description: 'Texto libre para búsqueda o filtrado simple.',
    }),
  );
}
