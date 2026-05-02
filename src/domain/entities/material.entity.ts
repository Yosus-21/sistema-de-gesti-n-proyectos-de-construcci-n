import { TipoMaterial } from '../enums';

export class Material {
  idMaterial?: number;
  nombre: string;
  descripcion: string;
  tipoMaterial: TipoMaterial;
  unidad: string;
  cantidadDisponible: number;
  costoUnitario: number;
  especificacionesTecnicas?: string;

  constructor(data: Partial<Material> = {}) {
    Object.assign(this, data);
  }

  actualizarStock(cantidad: number): void {
    this.cantidadDisponible = cantidad;
  }

  verificarDisponibilidad(cantidad: number): boolean {
    return this.cantidadDisponible >= cantidad;
  }
}
