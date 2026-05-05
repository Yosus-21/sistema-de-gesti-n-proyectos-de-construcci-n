export interface Proveedor {
  idProveedor: number;
  nombre: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  nit?: string;
  activo?: boolean;
  fechaRegistro?: string;
}

export interface RegistrarProveedorDto {
  nombre: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  nit?: string;
}

export interface ModificarProveedorDto extends Partial<RegistrarProveedorDto> {
  activo?: boolean;
}

export interface ListarProveedoresParams {
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface ValidarProveedorResponse {
  idProveedor: number;
  nombre: string;
  esValido: boolean;
  mensaje: string;
}
