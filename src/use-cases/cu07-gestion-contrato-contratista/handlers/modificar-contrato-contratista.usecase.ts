import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Contrato } from '../../../domain';
import {
  CONTRATO_REPOSITORY,
  type ContratoRepository,
} from '../../../infrastructure';
import { ModificarContratoContratistaDto } from '../dto';

@Injectable()
export class ModificarContratoContratistaUseCase {
  constructor(
    @Inject(CONTRATO_REPOSITORY)
    private readonly contratoRepository: ContratoRepository,
  ) {}

  async execute(dto: ModificarContratoContratistaDto): Promise<Contrato> {
    const contratoActual = await this.contratoRepository.findById(
      dto.idContrato,
    );

    if (!contratoActual) {
      throw new NotFoundException(
        `No se encontro el contrato con id ${dto.idContrato}.`,
      );
    }

    const fechaInicio = dto.fechaInicio
      ? new Date(dto.fechaInicio)
      : contratoActual.fechaInicio;
    const fechaFin = dto.fechaFin
      ? new Date(dto.fechaFin)
      : contratoActual.fechaFin;

    if (fechaFin.getTime() < fechaInicio.getTime()) {
      throw new BadRequestException(
        'La fecha de fin no puede ser anterior a la fecha de inicio.',
      );
    }

    const datosActualizacion: Partial<Contrato> = {
      ...(dto.idProyecto !== undefined ? { idProyecto: dto.idProyecto } : {}),
      ...(dto.idContratista !== undefined
        ? { idContratista: dto.idContratista }
        : {}),
      ...(dto.metodoPago !== undefined ? { metodoPago: dto.metodoPago } : {}),
      ...(dto.terminosYCondiciones !== undefined
        ? { terminosYCondiciones: dto.terminosYCondiciones }
        : {}),
      ...(dto.fechaInicio ? { fechaInicio } : {}),
      ...(dto.fechaFin ? { fechaFin } : {}),
      ...(dto.detalles
        ? {
            costoTotal: this.calcularCostoTotal(
              dto.detalles,
              fechaInicio,
              fechaFin,
            ),
          }
        : {}),
    };

    return this.contratoRepository.update(dto.idContrato, datosActualizacion);
  }

  private calcularCostoTotal(
    detalles: NonNullable<ModificarContratoContratistaDto['detalles']>,
    fechaInicio: Date,
    fechaFin: Date,
  ): number {
    const diasContrato = Math.max(
      1,
      Math.ceil(
        (fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );

    const costoDiario = detalles.reduce(
      (total, detalle) =>
        total + detalle.cantidadPersonas * detalle.costoUnitarioPorDia,
      0,
    );

    return diasContrato * costoDiario;
  }
}
