export class Cliente {
  idCliente?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  tipoCliente: string;

  constructor(data: Partial<Cliente> = {}) {
    Object.assign(this, data);
  }

  validarDatos(): boolean {
    // TODO: implementar validacion real en una fase posterior.
    return true;
  }

  obtenerDatosContacto(): string {
    return `${this.telefono} - ${this.correo}`;
  }
}
