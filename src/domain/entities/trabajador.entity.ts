import { OcupacionTrabajador } from '../enums';

export class Trabajador {
  idTrabajador?: number;
  nombre: string;
  ci: string;
  telefono: string;
  correo: string;
  licenciaProfesional?: string;
  aniosExperiencia: number;
  especializaciones?: string;
  certificaciones?: string;
  ocupacion: OcupacionTrabajador;

  constructor(data: Partial<Trabajador> = {}) {
    Object.assign(this, data);
  }

  obtenerDatosContacto(): string {
    return `${this.telefono} - ${this.correo}`;
  }
}
