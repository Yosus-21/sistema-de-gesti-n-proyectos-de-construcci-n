import { Inject, Injectable } from '@nestjs/common';
import { AsignacionMaterial } from '../../../domain';
import {
  ASIGNACION_MATERIAL_REPOSITORY,
  type AsignacionMaterialRepository,
} from '../../../infrastructure';
import { ListarAsignacionesMaterialDto } from '../dto';

@Injectable()
export class ListarAsignacionesMaterialUseCase {
  constructor(
    @Inject(ASIGNACION_MATERIAL_REPOSITORY)
    private readonly asignacionMaterialRepository: AsignacionMaterialRepository,
  ) {}

  async execute(
    dto: ListarAsignacionesMaterialDto,
  ): Promise<AsignacionMaterial[]> {
    return this.asignacionMaterialRepository.findMany({
      idTarea: dto.idTarea,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
