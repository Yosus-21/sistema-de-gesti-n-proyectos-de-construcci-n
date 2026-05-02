import { Inject, Injectable } from '@nestjs/common';
import { Proveedor } from '../../../domain';
import {
  PROVEEDOR_REPOSITORY,
  type ProveedorRepository,
} from '../../../infrastructure';
import { ListarProveedoresDto } from '../dto';

@Injectable()
export class ListarProveedoresUseCase {
  constructor(
    @Inject(PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ProveedorRepository,
  ) {}

  async execute(dto: ListarProveedoresDto): Promise<Proveedor[]> {
    return this.proveedorRepository.findMany({
      busqueda: dto.busqueda,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
