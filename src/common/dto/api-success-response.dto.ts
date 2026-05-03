import { ApiProperty } from '@nestjs/swagger';

export class ApiSuccessResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indica que la operación HTTP se procesó correctamente.',
  })
  success: boolean;

  @ApiProperty({
    example: '2026-05-02T10:30:00.000Z',
    description: 'Marca temporal ISO 8601 generada por el interceptor global.',
  })
  timestamp: string;

  @ApiProperty({
    type: Object,
    description:
      'Carga útil real de la respuesta, envuelta por el ResponseInterceptor.',
  })
  data: unknown;
}
