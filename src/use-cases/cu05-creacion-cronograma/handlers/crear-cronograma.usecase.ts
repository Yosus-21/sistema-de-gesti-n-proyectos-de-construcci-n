import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cronograma } from '../../../domain';
import {
  CRONOGRAMA_REPOSITORY,
  PROYECTO_REPOSITORY,
  type CronogramaRepository,
  type ProyectoRepository,
} from '../../../infrastructure';
import { CrearCronogramaDto } from '../dto';

@Injectable()
export class CrearCronogramaUseCase {
  constructor(
    @Inject(CRONOGRAMA_REPOSITORY)
    private readonly cronogramaRepository: CronogramaRepository,
    @Inject(PROYECTO_REPOSITORY)
    private readonly proyectoRepository: ProyectoRepository,
  ) {}

  async execute(dto: CrearCronogramaDto): Promise<Cronograma> {
    const proyecto = await this.proyectoRepository.findById(dto.idProyecto);

    if (!proyecto) {
      throw new NotFoundException(
        `No se encontro el proyecto con id ${dto.idProyecto}.`,
      );
    }

    const yaTieneCronograma = await this.cronogramaRepository.existsByProyecto(
      dto.idProyecto,
    );

    if (yaTieneCronograma) {
      throw new ConflictException(
        'El proyecto ya tiene un cronograma registrado.',
      );
    }

    const cronograma = new Cronograma({
      idProyecto: dto.idProyecto,
      nombre: dto.nombre,
      fechaCreacion: new Date(),
      estadoCronograma: dto.estadoInicial,
      accionesAnteRetraso: dto.accionesAnteRetraso,
    });

    return this.cronogramaRepository.create(cronograma);
  }
}
