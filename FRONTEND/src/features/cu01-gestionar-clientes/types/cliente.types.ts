export interface Cliente {
  idCliente: number;
  nombre: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  tipoCliente?: string;
  fechaRegistro?: string;
  activo?: boolean;
}

export interface RegistrarClienteDto {
  nombre: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  tipoCliente?: string;
}

export type ModificarClienteDto = Partial<RegistrarClienteDto>;

export interface ListarClientesParams {
  busqueda?: string;
  pagina?: number;
  limite?: number;
}
