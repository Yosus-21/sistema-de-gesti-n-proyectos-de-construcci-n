import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Contrato, ContratoDetalle } from '../../../domain';
import {
  CONTRATISTA_REPOSITORY,
  CONTRATO_REPOSITORY,
  PROYECTO_REPOSITORY,
  type ContratistaRepository,
  type ContratoRepository,
  type ProyectoRepository,
} from '../../../infrastructure';
import { RegistrarContratoContratistaDto } from '../dto';

@Injectable()
export class RegistrarContratoContratistaUseCase {
  constructor(
    @Inject(CONTRATO_REPOSITORY)
    private readonly contratoRepository: ContratoRepository,
    @Inject(CONTRATISTA_REPOSITORY)
    private readonly contratistaRepository: ContratistaRepository,
    @Inject(PROYECTO_REPOSITORY)
    private readonly proyectoRepository: ProyectoRepository,
  ) {}

  async execute(dto: RegistrarContratoContratistaDto): Promise<Contrato> {
    const proyecto = await this.proyectoRepository.findById(dto.idProyecto);

    if (!proyecto) {
      throw new NotFoundException(
        `No se encontro el proyecto con id ${dto.idProyecto}.`,
      );
    }

    const contratista = await this.contratistaRepository.findById(
      dto.idContratista,
    );

    if (!contratista) {
      throw new NotFoundException(
        `No se encontro el contratista con id ${dto.idContratista}.`,
      );
    }

    const fechaInicio = new Date(dto.fechaInicio);
    const fechaFin = new Date(dto.fechaFin);

    this.validarRangoFechas(fechaInicio, fechaFin);

    const contrato = new Contrato({
      idProyecto: dto.idProyecto,
      idContratista: dto.idContratista,
      fechaInicio,
      fechaFin,
      metodoPago: dto.metodoPago,
      terminosYCondiciones: dto.terminosYCondiciones,
      estadoContrato: 'VIGENTE',
      costoTotal: this.calcularCostoTotal(dto.detalles, fechaInicio, fechaFin),
      detalles: dto.detalles?.map(
        (d) =>
          new ContratoDetalle({
            cantidadPersonas: d.cantidadPersonas,
            costoUnitarioPorDia: d.costoUnitarioPorDia,
            idCargo: d.idCargo,
          }),
      ),
    });

    return this.contratoRepository.create(contrato);
  }

  private validarRangoFechas(fechaInicio: Date, fechaFin: Date): void {
    if (fechaFin.getTime() < fechaInicio.getTime()) {
      throw new BadRequestException(
        'La fecha de fin no puede ser anterior a la fecha de inicio.',
      );
    }
  }

  private calcularCostoTotal(
    detalles: RegistrarContratoContratistaDto['detalles'],
    fechaInicio: Date,
    fechaFin: Date,
  ): number {
    if (!detalles || detalles.length === 0) {
      return 0;
    }

    for (const detalle of detalles) {
      if (detalle.cantidadPersonas <= 0) {
        throw new BadRequestException(
          'La cantidad de personas debe ser mayor a 0',
        );
      }
      if (detalle.costoUnitarioPorDia < 0) {
        throw new BadRequestException(
          'El costo unitario debe ser mayor o igual a 0',
        );
      }
    }

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
