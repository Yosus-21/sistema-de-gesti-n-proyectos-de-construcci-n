export class Proveedor {
  idProveedor?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  terminosEntrega?: string;

  constructor(data: Partial<Proveedor> = {}) {
    Object.assign(this, data);
  }

  obtenerDatosContacto(): string {
    return `${this.telefono} - ${this.correo}`;
  }
}
