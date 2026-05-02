import { Inject, Injectable } from '@nestjs/common';
import { Proyecto } from '../../../domain';
import {
  PROYECTO_REPOSITORY,
  type ProyectoRepository,
} from '../../../infrastructure';
import { ListarProyectosDto } from '../dto';

@Injectable()
export class ListarProyectosUseCase {
  constructor(
    @Inject(PROYECTO_REPOSITORY)
    private readonly proyectoRepository: ProyectoRepository,
  ) {}

  async execute(dto: ListarProyectosDto): Promise<Proyecto[]> {
    return this.proyectoRepository.findMany({
      idCliente: dto.idCliente,
      busqueda: dto.busqueda,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
