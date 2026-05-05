export type TipoAlerta = 'MATERIAL_BAJO' | 'RETRASO_TAREA' | 'CRONOGRAMA_REPLANIFICADO' | 'CONTRATO_VENCIDO' | 'PRONOSTICO_STOCK';
export type EstadoAlerta = 'ACTIVA' | 'INACTIVA' | 'NOTIFICADA';
export type MetodoNotificacion = 'SISTEMA' | 'EMAIL';

export interface Alerta {
  idAlerta: number;
  idProyecto?: number;
  idTarea?: number;
  idMaterial?: number;
  tipoAlerta?: TipoAlerta;
  estadoAlerta?: EstadoAlerta;
  mensajeNotificacion?: string;
  metodoNotificacion?: MetodoNotificacion;
  fechaGeneracion?: string;
  correoDestino?: string;
  observaciones?: string;
  // Relaciones opcionales para visualización
  proyecto?: { nombre: string };
  tarea?: { nombre: string };
  material?: { nombre: string };
}

export interface ConfigurarAlertaDto {
  tipoAlerta: TipoAlerta;
  idProyecto?: number;
  idTarea?: number;
  idMaterial?: number;
  mensajeNotificacion?: string;
  metodoNotificacion?: MetodoNotificacion;
  correoDestino?: string;
  observaciones?: string;
}

export interface GenerarNotificacionDto {
  metodoNotificacion: MetodoNotificacion;
  mensajeNotificacion: string;
  correoDestino?: string;
}

export interface ListarAlertasParams {
  idProyecto?: number;
  idTarea?: number;
  idMaterial?: number;
  tipoAlerta?: TipoAlerta;
  estadoAlerta?: EstadoAlerta;
  pagina?: number;
  limite?: number;
}

export interface GenerarNotificacionResponse {
  notificada: boolean;
  envioEmail?: {
    sent: boolean;
    provider?: string;
    reason?: string;
    messageId?: string;
  };
}
