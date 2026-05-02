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
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { GestionContratoContratistaService } from './gestion-contrato-contratista.service';
import {
  CalcularCostoContratoDto,
  ConsultarContratoContratistaDto,
  ListarContratosContratistaDto,
  ModificarContratoContratistaDto,
  RegistrarContratoContratistaDto,
  ValidarVigenciaContratoDto,
} from './dto';

class DetalleContratoContratistaBodyDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idCargo?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  cantidadPersonas: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costoUnitarioPorDia: number;
}

class ModificarContratoContratistaBodyDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idProyecto?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idContratista?: number;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @IsString()
  metodoPago?: string;

  @IsOptional()
  @IsString()
  terminosYCondiciones?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetalleContratoContratistaBodyDto)
  detalles?: DetalleContratoContratistaBodyDto[];
}

class ValidarVigenciaContratoQueryDto {
  @IsOptional()
  @IsDateString()
  fechaReferencia?: string;
}

@Controller('cu07/contratos-contratistas')
export class GestionContratoContratistaController {
  constructor(
    private readonly gestionContratoContratistaService: GestionContratoContratistaService,
  ) {}

  @Get('health')
  check() {
    return this.gestionContratoContratistaService.check();
  }

  @Post()
  registrar(@Body() dto: RegistrarContratoContratistaDto) {
    return this.gestionContratoContratistaService.registrar(dto);
  }

  @Get()
  listar(@Query() dto: ListarContratosContratistaDto) {
    return this.gestionContratoContratistaService.listar(dto);
  }

  @Get(':idContrato/costo')
  calcularCosto(@Param('idContrato', ParseIntPipe) idContrato: number) {
    const dto: CalcularCostoContratoDto = { idContrato };
    return this.gestionContratoContratistaService.calcularCosto(dto);
  }

  @Get(':idContrato/vigencia')
  validarVigencia(
    @Param('idContrato', ParseIntPipe) idContrato: number,
    @Query() query: ValidarVigenciaContratoQueryDto,
  ) {
    const dto: ValidarVigenciaContratoDto = {
      ...query,
      idContrato,
    };

    return this.gestionContratoContratistaService.validarVigencia(dto);
  }

  @Get(':idContrato')
  consultar(@Param('idContrato', ParseIntPipe) idContrato: number) {
    const dto: ConsultarContratoContratistaDto = { idContrato };
    return this.gestionContratoContratistaService.consultar(dto);
  }

  @Patch(':idContrato')
  modificar(
    @Param('idContrato', ParseIntPipe) idContrato: number,
    @Body() dto: ModificarContratoContratistaBodyDto,
  ) {
    const command: ModificarContratoContratistaDto = {
      ...dto,
      idContrato,
    };

    return this.gestionContratoContratistaService.modificar(command);
  }
}
