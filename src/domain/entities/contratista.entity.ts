export class Contratista {
  idContratista?: number;
  nombre: string;
  ci: string;
  empresa?: string;
  telefono: string;
  correo: string;

  constructor(data: Partial<Contratista> = {}) {
    Object.assign(this, data);
  }

  obtenerDatosContacto(): string {
    return `${this.telefono} - ${this.correo}`;
  }
}
