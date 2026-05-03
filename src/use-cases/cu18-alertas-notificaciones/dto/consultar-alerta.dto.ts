import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConsultarAlertaDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idAlerta: number;
}
