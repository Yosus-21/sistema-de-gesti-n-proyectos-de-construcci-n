import { EstadoProyecto } from '../enums';

export class Proyecto {
  idProyecto?: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  presupuesto: number;
  fechaInicio: Date;
  fechaFinEstimada: Date;
  estadoProyecto: EstadoProyecto;
  especificacionesTecnicas: string;
  idCliente?: number;

  constructor(data: Partial<Proyecto> = {}) {
    Object.assign(this, data);
  }

  cambiarEstado(nuevoEstado: EstadoProyecto): void {
    this.estadoProyecto = nuevoEstado;
  }

  calcularDesviacionPresupuesto(): number {
    // TODO: implementar calculo real en una fase posterior.
    return 0;
  }
}
