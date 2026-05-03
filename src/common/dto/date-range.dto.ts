import { IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DateRangeDto {
  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional()
  fechaFin?: string;
}
