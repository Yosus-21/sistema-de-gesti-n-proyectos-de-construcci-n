import { Inject, Injectable } from '@nestjs/common';
import { PronosticoMaterial } from '../../../domain';
import {
  PRONOSTICO_MATERIAL_REPOSITORY,
  type PronosticoMaterialRepository,
} from '../../../infrastructure';
import { ListarPronosticosMaterialDto } from '../dto';

@Injectable()
export class ListarPronosticosMaterialUseCase {
  constructor(
    @Inject(PRONOSTICO_MATERIAL_REPOSITORY)
    private readonly pronosticoMaterialRepository: PronosticoMaterialRepository,
  ) {}

  async execute(
    dto: ListarPronosticosMaterialDto,
  ): Promise<PronosticoMaterial[]> {
    return this.pronosticoMaterialRepository.findMany({
      idProyecto: dto.idProyecto,
      idMaterial: dto.idMaterial,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
