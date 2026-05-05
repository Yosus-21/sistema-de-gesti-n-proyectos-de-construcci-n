export const OcupacionTrabajador = {
  ALBANIL: 'ALBANIL',
  PLOMERO: 'PLOMERO',
  ELECTRICISTA: 'ELECTRICISTA',
  VIDRIERO: 'VIDRIERO',
  CARPINTERO: 'CARPINTERO',
} as const;

export type OcupacionTrabajador = typeof OcupacionTrabajador[keyof typeof OcupacionTrabajador];

export interface Trabajador {
  idTrabajador: number;
  nombres: string;
  apellidos?: string;
  ci: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  ocupacion: OcupacionTrabajador;
  tarifaHora?: number;
  activo: boolean;
  fechaRegistro?: string;
}

export interface RegistrarTrabajadorDto {
  nombres: string;
  apellidos?: string;
  ci: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  ocupacion: OcupacionTrabajador;
  tarifaHora?: number;
}

export interface ModificarTrabajadorDto {
  nombres?: string;
  apellidos?: string;
  ci?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  ocupacion?: OcupacionTrabajador;
  tarifaHora?: number;
  activo?: boolean;
}

export interface ListarTrabajadoresParams {
  ocupacion?: OcupacionTrabajador;
  busqueda?: string;
  pagina?: number;
  limite?: number;
}

export interface VerificarDisponibilidadTrabajadorParams {
  fechaInicio: string;
  fechaFin: string;
}

export interface ConflictoDisponibilidad {
  idTarea: number;
  nombreTarea?: string;
  fechaInicio: string;
  fechaFin: string;
  estadoAsignacion: string;
}

export interface DisponibilidadTrabajadorResponse {
  disponible: boolean;
  rangoConsultado: {
    fechaInicio: string;
    fechaFin: string;
  };
  conflictos: ConflictoDisponibilidad[];
}
