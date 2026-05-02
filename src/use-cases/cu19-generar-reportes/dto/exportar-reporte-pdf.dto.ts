import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ExportarReportePdfDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idReporte: number;
}
