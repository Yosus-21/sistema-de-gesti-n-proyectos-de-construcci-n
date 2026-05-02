import { EstadoAlerta, MetodoNotificacion, TipoAlerta } from '../enums';

export class Alerta {
  idAlerta?: number;
  criterioActivacion: string;
  tipoAlerta: TipoAlerta;
  estadoAlerta: EstadoAlerta;
  mensajeNotificacion?: string;
  metodoNotificacion?: MetodoNotificacion;
  fechaGeneracion?: Date;
  idProyecto?: number;
  idTarea?: number;
  idMaterial?: number;

  constructor(data: Partial<Alerta> = {}) {
    Object.assign(this, data);
  }

  cambiarEstado(nuevoEstado: EstadoAlerta): void {
    this.estadoAlerta = nuevoEstado;
  }
}
