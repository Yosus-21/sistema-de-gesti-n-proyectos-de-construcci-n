import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConsultarProveedorDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty()
  idProveedor: number;
}
