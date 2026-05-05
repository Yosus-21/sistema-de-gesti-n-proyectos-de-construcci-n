export type EstadoContrato = 'VIGENTE' | 'FINALIZADO' | 'CANCELADO';

export interface ContratoDetalle {
  idContratoDetalle?: number;
  idContrato?: number;
  descripcion: string;
  cantidadPersonas?: number;
  cantidad?: number;
  costoUnitarioPorDia?: number;
  costoUnitario?: number;
  subtotal?: number;
  idCargo?: number;
}

export interface ContratoContratista {
  idContrato: number;
  idProyecto: number;
  idContratista: number;
  fechaInicio: string;
  fechaFin: string;
  costoTotal: number;
  estadoContrato: EstadoContrato;
  descripcion?: string;
  condiciones?: string;
  detalles?: ContratoDetalle[];
  proyecto?: {
    nombre: string;
  };
  contratista?: {
    nombreEmpresa: string;
    representante: string;
  };
}

export interface RegistrarContratoContratistaDto {
  idProyecto: number;
  idContratista: number;
  fechaInicio: string;
  fechaFin: string;
  descripcion?: string;
  condiciones?: string;
  detalles: ContratoDetalle[];
}

export interface ModificarContratoContratistaDto {
  idProyecto?: number;
  idContratista?: number;
  fechaInicio?: string;
  fechaFin?: string;
  descripcion?: string;
  condiciones?: string;
  estadoContrato?: EstadoContrato;
  detalles?: ContratoDetalle[];
}

export interface ListarContratosContratistaParams {
  idProyecto?: number;
  idContratista?: number;
  pagina?: number;
  limite?: number;
}

export interface CalcularCostoContratoResponse {
  idContrato: number;
  costoTotal: number;
  metodoCalculo: string;
}

export interface ValidarVigenciaContratoResponse {
  idContrato: number;
  esVigente: boolean;
  fechaInicio: string;
  fechaFin: string;
  fechaReferencia: string;
  mensaje: string;
}
