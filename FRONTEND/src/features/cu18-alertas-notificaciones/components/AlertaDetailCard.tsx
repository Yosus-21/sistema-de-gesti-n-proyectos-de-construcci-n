import { Card, Badge } from '../../../shared/components';
import type { Alerta } from '../types/alerta-notificacion.types';

interface AlertaDetailCardProps {
  alerta: Alerta;
}

export function AlertaDetailCard({ alerta }: AlertaDetailCardProps) {
  const getEstadoVariant = (estado?: string) => {
    switch (estado) {
      case 'ACTIVA': return 'success';
      case 'INACTIVA': return 'warning';
      case 'NOTIFICADA': return 'info';
      default: return 'neutral';
    }
  };

  return (
    <div className="detail-grid">
      <Card title="Información de la Alerta">
        <div className="detail-info">
          <div className="info-item">
            <span className="label">ID:</span>
            <span className="value">{alerta.idAlerta}</span>
          </div>
          <div className="info-item">
            <span className="label">Tipo:</span>
            <span className="value">{alerta.tipoAlerta}</span>
          </div>
          <div className="info-item">
            <span className="label">Estado:</span>
            <Badge variant={getEstadoVariant(alerta.estadoAlerta)}>{alerta.estadoAlerta}</Badge>
          </div>
          <div className="info-item">
            <span className="label">Fecha Generación:</span>
            <span className="value">{alerta.fechaGeneracion ? new Date(alerta.fechaGeneracion).toLocaleString() : '-'}</span>
          </div>
        </div>
      </Card>

      <Card title="Configuración de Notificación">
        <div className="detail-info">
          <div className="info-item">
            <span className="label">Método:</span>
            <span className="value">{alerta.metodoNotificacion}</span>
          </div>
          {alerta.metodoNotificacion === 'EMAIL' && (
            <div className="info-item">
              <span className="label">Correo Destino:</span>
              <span className="value">{alerta.correoDestino || 'No especificado'}</span>
            </div>
          )}
          <div className="info-item full">
            <span className="label">Mensaje:</span>
            <p className="description-text">{alerta.mensajeNotificacion || 'Sin mensaje configurado'}</p>
          </div>
        </div>
      </Card>

      <Card title="Destino Asociado">
        <div className="detail-info">
          {alerta.proyecto && (
            <div className="info-item">
              <span className="label">Proyecto:</span>
              <span className="value">{alerta.proyecto.nombre}</span>
            </div>
          )}
          {alerta.tarea && (
            <div className="info-item">
              <span className="label">Tarea:</span>
              <span className="value">{alerta.tarea.nombre}</span>
            </div>
          )}
          {alerta.material && (
            <div className="info-item">
              <span className="label">Material:</span>
              <span className="value">{alerta.material.nombre}</span>
            </div>
          )}
          {!alerta.proyecto && !alerta.tarea && !alerta.material && (
            <p>No hay un destino específico asociado.</p>
          )}
        </div>
      </Card>

      {alerta.observaciones && (
        <Card title="Observaciones Adicionales" className="full-width-card">
          <p className="description-text">{alerta.observaciones}</p>
        </Card>
      )}
    </div>
  );
}
