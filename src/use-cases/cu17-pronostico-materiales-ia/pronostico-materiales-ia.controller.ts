import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PronosticoMaterialesIaService } from './pronostico-materiales-ia.service';
import {
  AjustarPronosticoMaterialDto,
  CalcularNivelConfianzaPronosticoDto,
  ConfirmarPronosticoMaterialDto,
  GenerarPronosticoMaterialDto,
  ListarPronosticosMaterialDto,
} from './dto';

class AjustarPronosticoMaterialBodyDto implements Omit<
  AjustarPronosticoMaterialDto,
  'idPronosticoMaterial'
> {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockMinimo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockMaximo?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}

@Controller('cu17/pronostico-materiales-ia')
export class PronosticoMaterialesIaController {
  constructor(
    private readonly pronosticoMaterialesIaService: PronosticoMaterialesIaService,
  ) {}

  @Get('health')
  check() {
    return this.pronosticoMaterialesIaService.check();
  }

  @Post()
  generar(@Body() dto: GenerarPronosticoMaterialDto) {
    return this.pronosticoMaterialesIaService.generar(dto);
  }

  @Get()
  listar(@Query() dto: ListarPronosticosMaterialDto) {
    return this.pronosticoMaterialesIaService.listar(dto);
  }

  @Patch(':idPronosticoMaterial/ajustar')
  ajustar(
    @Param('idPronosticoMaterial', ParseIntPipe)
    idPronosticoMaterial: number,
    @Body() dto: AjustarPronosticoMaterialBodyDto,
  ) {
    const command: AjustarPronosticoMaterialDto = {
      ...dto,
      idPronosticoMaterial,
    };

    return this.pronosticoMaterialesIaService.ajustar(command);
  }

  @Patch(':idPronosticoMaterial/confirmar')
  confirmar(
    @Param('idPronosticoMaterial', ParseIntPipe)
    idPronosticoMaterial: number,
  ) {
    const dto: ConfirmarPronosticoMaterialDto = { idPronosticoMaterial };
    return this.pronosticoMaterialesIaService.confirmar(dto);
  }

  @Get(':idPronosticoMaterial/confianza')
  calcularNivelConfianza(
    @Param('idPronosticoMaterial', ParseIntPipe)
    idPronosticoMaterial: number,
  ) {
    const dto: CalcularNivelConfianzaPronosticoDto = {
      idPronosticoMaterial,
    };

    return this.pronosticoMaterialesIaService.calcularNivelConfianza(dto);
  }
}
