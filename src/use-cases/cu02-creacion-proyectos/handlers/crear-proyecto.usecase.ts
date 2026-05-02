import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EstadoProyecto, Proyecto } from '../../../domain';
import {
  CLIENTE_REPOSITORY,
  PROYECTO_REPOSITORY,
  type ClienteRepository,
  type ProyectoRepository,
} from '../../../infrastructure';
import { CrearProyectoDto } from '../dto';

@Injectable()
export class CrearProyectoUseCase {
  constructor(
    @Inject(PROYECTO_REPOSITORY)
    private readonly proyectoRepository: ProyectoRepository,
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepository: ClienteRepository,
  ) {}

  async execute(dto: CrearProyectoDto): Promise<Proyecto> {
    const cliente = await this.clienteRepository.findById(dto.idCliente);

    if (!cliente) {
      throw new NotFoundException(
        `No se encontro el cliente con id ${dto.idCliente}.`,
      );
    }

    const fechaInicio = new Date(dto.fechaInicio);
    const fechaFinEstimada = new Date(dto.fechaFinEstimada);

    if (fechaFinEstimada < fechaInicio) {
      throw new BadRequestException(
        'La fecha fin estimada no puede ser anterior a la fecha de inicio.',
      );
    }

    const proyecto = new Proyecto({
      idCliente: dto.idCliente,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      ubicacion: dto.ubicacion,
      presupuesto: dto.presupuesto,
      fechaInicio,
      fechaFinEstimada,
      estadoProyecto: EstadoProyecto.PLANIFICACION,
      especificacionesTecnicas: dto.especificacionesTecnicas,
    });

    return this.proyectoRepository.create(proyecto);
  }
}
