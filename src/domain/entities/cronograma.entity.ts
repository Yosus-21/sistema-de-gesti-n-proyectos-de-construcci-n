import { EstadoCronograma } from '../enums';

export class Cronograma {
  idCronograma?: number;
  nombre: string;
  fechaCreacion: Date;
  estadoCronograma: EstadoCronograma;
  fechaUltimaModificacion?: Date;
  motivoReplanificacion?: string;
  accionesAnteRetraso?: string;
  idProyecto?: number;

  constructor(data: Partial<Cronograma> = {}) {
    Object.assign(this, data);
  }

  registrarFechaSeguimiento(fecha: Date): void {
    this.fechaUltimaModificacion = fecha;
  }

  calcularAvanceGlobal(): number {
    // TODO: implementar calculo real en una fase posterior.
    return 0;
  }
}
