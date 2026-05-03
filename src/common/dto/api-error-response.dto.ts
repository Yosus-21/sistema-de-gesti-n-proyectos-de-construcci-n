import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({
    example: false,
    description: 'Indica que la operación HTTP terminó con error.',
  })
  success: boolean;

  @ApiProperty({
    example: 400,
    description: 'Código de estado HTTP devuelto por el backend.',
  })
  statusCode: number;

  @ApiProperty({
    example: '2026-05-02T10:30:00.000Z',
    description: 'Marca temporal ISO 8601 generada por el filtro global.',
  })
  timestamp: string;

  @ApiProperty({
    example: '/cu12/materiales/999',
    description: 'Ruta HTTP solicitada cuando ocurrió el error.',
  })
  path: string;

  @ApiProperty({
    oneOf: [
      { type: 'string', example: 'Recurso no encontrado.' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['El campo nombre es obligatorio.'],
      },
    ],
    description:
      'Mensaje principal del error. Puede ser texto simple o una lista de mensajes de validación.',
  })
  message: string | string[];

  @ApiPropertyOptional({
    type: [Object],
    description:
      'Detalle adicional de errores cuando existe más de una validación fallida.',
  })
  errors?: unknown[];
}
