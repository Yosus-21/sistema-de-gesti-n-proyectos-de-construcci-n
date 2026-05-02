import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Trabajador } from '../../../domain';
import {
  TRABAJADOR_REPOSITORY,
  type TrabajadorRepository,
} from '../../../infrastructure';
import { ModificarTrabajadorDto } from '../dto';

@Injectable()
export class ModificarTrabajadorUseCase {
  constructor(
    @Inject(TRABAJADOR_REPOSITORY)
    private readonly trabajadorRepository: TrabajadorRepository,
  ) {}

  async execute(dto: ModificarTrabajadorDto): Promise<Trabajador> {
    const trabajadorActual = await this.trabajadorRepository.findById(
      dto.idTrabajador,
    );

    if (!trabajadorActual) {
      throw new NotFoundException(
        `No se encontro el trabajador con id ${dto.idTrabajador}.`,
      );
    }

    const ciFinal = dto.ci ?? trabajadorActual.ci;
    const correoFinal = dto.correo ?? trabajadorActual.correo;
    const cambioCiOCorreo =
      ciFinal !== trabajadorActual.ci ||
      correoFinal !== trabajadorActual.correo;

    if (cambioCiOCorreo) {
      const existeDuplicado =
        await this.trabajadorRepository.existsByCiOrCorreoExcludingId(
          ciFinal,
          correoFinal,
          dto.idTrabajador,
        );

      if (existeDuplicado) {
        throw new ConflictException(
          'Ya existe otro trabajador registrado con el mismo CI o correo.',
        );
      }
    }

    const { idTrabajador, ...cambios } = dto;

    return this.trabajadorRepository.update(idTrabajador, cambios);
  }
}
