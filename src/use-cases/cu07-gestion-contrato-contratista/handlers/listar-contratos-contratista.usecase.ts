import { Inject, Injectable } from '@nestjs/common';
import { Contrato } from '../../../domain';
import {
  CONTRATO_REPOSITORY,
  type ContratoRepository,
} from '../../../infrastructure';
import { ListarContratosContratistaDto } from '../dto';

@Injectable()
export class ListarContratosContratistaUseCase {
  constructor(
    @Inject(CONTRATO_REPOSITORY)
    private readonly contratoRepository: ContratoRepository,
  ) {}

  async execute(dto: ListarContratosContratistaDto): Promise<Contrato[]> {
    return this.contratoRepository.findMany({
      idProyecto: dto.idProyecto,
      idContratista: dto.idContratista,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
