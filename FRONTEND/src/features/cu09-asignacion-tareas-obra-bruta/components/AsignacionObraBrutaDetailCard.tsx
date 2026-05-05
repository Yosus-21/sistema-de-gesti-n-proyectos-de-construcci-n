import { Card, Badge } from '../../../shared/components';
import type { AsignacionObraBruta } from '../types/asignacion-obra-bruta.types';

interface AsignacionObraBrutaDetailCardProps {
  asignacion: AsignacionObraBruta;
}

export function AsignacionObraBrutaDetailCard({ asignacion }: AsignacionObraBrutaDetailCardProps) {
  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADA': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'CANCELADA': return 'danger';
      case 'REASIGNADA': return 'info';
      default: return 'neutral';
    }
  };

  return (
    <Card title={`Asignación #${asignacion.idAsignacionTarea}`}>
      <div className="detail-grid">
        <div className="detail-item">
          <label>Tarea:</label>
          <p>{asignacion.tarea?.nombre || asignacion.idTarea}</p>
        </div>
        <div className="detail-item">
          <label>Trabajador:</label>
          <p>{asignacion.trabajador ? `${asignacion.trabajador.nombres} ${asignacion.trabajador.apellidos || ''}` : asignacion.idTrabajador}</p>
        </div>
        <div className="detail-item">
          <label>Estado:</label>
          <Badge variant={getBadgeVariant(asignacion.estadoAsignacion)}>{asignacion.estadoAsignacion}</Badge>
        </div>
        <div className="detail-item">
          <label>Fecha de Asignación:</label>
          <p>{asignacion.fechaAsignacion ? new Date(asignacion.fechaAsignacion).toLocaleString() : '-'}</p>
        </div>
        <div className="detail-item full-width">
          <label>Observaciones:</label>
          <p>{asignacion.observaciones || 'Sin observaciones'}</p>
        </div>
      </div>
    </Card>
  );
}
