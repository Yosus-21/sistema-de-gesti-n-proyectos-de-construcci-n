import { Inject, Injectable } from '@nestjs/common';
import { Seguimiento } from '../../../domain';
import {
  SEGUIMIENTO_REPOSITORY,
  type SeguimientoRepository,
} from '../../../infrastructure';
import { ListarSeguimientosDto } from '../dto';

@Injectable()
export class ListarSeguimientosUseCase {
  constructor(
    @Inject(SEGUIMIENTO_REPOSITORY)
    private readonly seguimientoRepository: SeguimientoRepository,
  ) {}

  async execute(dto: ListarSeguimientosDto): Promise<Seguimiento[]> {
    return this.seguimientoRepository.findMany({
      idTarea: dto.idTarea,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
