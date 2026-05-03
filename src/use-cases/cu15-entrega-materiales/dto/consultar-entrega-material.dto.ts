import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConsultarEntregaMaterialDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idEntregaMaterial: number;
}
