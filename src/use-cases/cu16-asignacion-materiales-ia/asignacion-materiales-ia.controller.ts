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
import { AsignacionMaterialesIaService } from './asignacion-materiales-ia.service';
import {
  AjustarAsignacionMaterialDto,
  ConfirmarAsignacionMaterialDto,
  GenerarPropuestaAsignacionMaterialDto,
  ListarAsignacionesMaterialDto,
  ValidarRestriccionesAsignacionMaterialDto,
} from './dto';

class AjustarAsignacionMaterialBodyDto implements Omit<
  AjustarAsignacionMaterialDto,
  'idAsignacionMaterial'
> {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cantidadAsignada?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costoMaximoPermitido?: number;

  @IsOptional()
  @IsString()
  restricciones?: string;
}

@Controller('cu16/asignacion-materiales-ia')
export class AsignacionMaterialesIaController {
  constructor(
    private readonly asignacionMaterialesIaService: AsignacionMaterialesIaService,
  ) {}

  @Get('health')
  check() {
    return this.asignacionMaterialesIaService.check();
  }

  @Post('propuestas')
  generarPropuesta(@Body() dto: GenerarPropuestaAsignacionMaterialDto) {
    return this.asignacionMaterialesIaService.generarPropuesta(dto);
  }

  @Get()
  listar(@Query() dto: ListarAsignacionesMaterialDto) {
    return this.asignacionMaterialesIaService.listar(dto);
  }

  @Post('validar-restricciones')
  validarRestricciones(@Body() dto: ValidarRestriccionesAsignacionMaterialDto) {
    return this.asignacionMaterialesIaService.validarRestricciones(dto);
  }

  @Patch(':idAsignacionMaterial/confirmar')
  confirmar(
    @Param('idAsignacionMaterial', ParseIntPipe)
    idAsignacionMaterial: number,
  ) {
    const dto: ConfirmarAsignacionMaterialDto = { idAsignacionMaterial };
    return this.asignacionMaterialesIaService.confirmar(dto);
  }

  @Patch(':idAsignacionMaterial/ajustar')
  ajustar(
    @Param('idAsignacionMaterial', ParseIntPipe)
    idAsignacionMaterial: number,
    @Body() dto: AjustarAsignacionMaterialBodyDto,
  ) {
    const command: AjustarAsignacionMaterialDto = {
      ...dto,
      idAsignacionMaterial,
    };

    return this.asignacionMaterialesIaService.ajustar(command);
  }
}
