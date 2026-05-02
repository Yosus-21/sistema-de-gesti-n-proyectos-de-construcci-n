import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Trabajador } from '../../../domain';
import {
  TRABAJADOR_REPOSITORY,
  type TrabajadorRepository,
} from '../../../infrastructure';
import { RegistrarTrabajadorDto } from '../dto';

@Injectable()
export class RegistrarTrabajadorUseCase {
  constructor(
    @Inject(TRABAJADOR_REPOSITORY)
    private readonly trabajadorRepository: TrabajadorRepository,
  ) {}

  async execute(dto: RegistrarTrabajadorDto): Promise<Trabajador> {
    const yaExiste = await this.trabajadorRepository.existsByCiOrCorreo(
      dto.ci,
      dto.correo,
    );

    if (yaExiste) {
      throw new ConflictException(
        'Ya existe un trabajador registrado con el mismo CI o correo.',
      );
    }

    const trabajador = new Trabajador({
      nombre: dto.nombre,
      ci: dto.ci,
      telefono: dto.telefono,
      correo: dto.correo,
      licenciaProfesional: dto.licenciaProfesional,
      aniosExperiencia: dto.aniosExperiencia,
      especializaciones: dto.especializaciones,
      certificaciones: dto.certificaciones,
      ocupacion: dto.ocupacion,
    });

    return this.trabajadorRepository.create(trabajador);
  }
}
