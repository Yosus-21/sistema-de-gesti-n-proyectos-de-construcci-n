import { Inject, Injectable } from '@nestjs/common';
import { EntregaMaterial } from '../../../domain';
import {
  ENTREGA_MATERIAL_REPOSITORY,
  type EntregaMaterialRepository,
} from '../../../infrastructure';
import { ListarEntregasMaterialDto } from '../dto';

@Injectable()
export class ListarEntregasMaterialUseCase {
  constructor(
    @Inject(ENTREGA_MATERIAL_REPOSITORY)
    private readonly entregaMaterialRepository: EntregaMaterialRepository,
  ) {}

  async execute(dto: ListarEntregasMaterialDto): Promise<EntregaMaterial[]> {
    return this.entregaMaterialRepository.findMany({
      idOrdenCompra: dto.idOrdenCompra,
      idMaterial: dto.idMaterial,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
