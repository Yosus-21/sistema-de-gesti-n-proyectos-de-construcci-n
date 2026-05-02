import { TipoTarea } from '../enums';

export class Cargo {
  idCargo?: number;
  nombre: string;
  descripcion: string;
  tipoObra: TipoTarea;
  licenciaRequerida?: string;

  constructor(data: Partial<Cargo> = {}) {
    Object.assign(this, data);
  }
}
