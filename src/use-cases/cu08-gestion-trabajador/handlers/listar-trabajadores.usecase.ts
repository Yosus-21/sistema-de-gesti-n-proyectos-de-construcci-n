import { Inject, Injectable } from '@nestjs/common';
import { Trabajador } from '../../../domain';
import {
  TRABAJADOR_REPOSITORY,
  type TrabajadorRepository,
} from '../../../infrastructure';
import { ListarTrabajadoresDto } from '../dto';

@Injectable()
export class ListarTrabajadoresUseCase {
  constructor(
    @Inject(TRABAJADOR_REPOSITORY)
    private readonly trabajadorRepository: TrabajadorRepository,
  ) {}

  async execute(dto: ListarTrabajadoresDto): Promise<Trabajador[]> {
    return this.trabajadorRepository.findMany({
      ocupacion: dto.ocupacion,
      busqueda: dto.busqueda,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
