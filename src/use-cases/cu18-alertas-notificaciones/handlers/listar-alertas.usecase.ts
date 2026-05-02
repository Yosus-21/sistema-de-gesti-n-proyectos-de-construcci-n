import { Inject, Injectable } from '@nestjs/common';
import { Alerta } from '../../../domain';
import {
  ALERTA_REPOSITORY,
  type AlertaRepository,
} from '../../../infrastructure';
import { ListarAlertasDto } from '../dto';

@Injectable()
export class ListarAlertasUseCase {
  constructor(
    @Inject(ALERTA_REPOSITORY)
    private readonly alertaRepository: AlertaRepository,
  ) {}

  async execute(dto: ListarAlertasDto): Promise<Alerta[]> {
    return this.alertaRepository.findMany({
      idProyecto: dto.idProyecto,
      idTarea: dto.idTarea,
      idMaterial: dto.idMaterial,
      tipoAlerta: dto.tipoAlerta,
      estadoAlerta: dto.estadoAlerta,
      pagina: dto.pagina,
      limite: dto.limite,
    });
  }
}
