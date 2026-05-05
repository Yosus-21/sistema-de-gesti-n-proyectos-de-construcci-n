import { Card, Badge } from '../../../shared/components';
import type { AsignacionContratista } from '../types/asignacion-contratista.types';

interface AsignacionContratistaDetailCardProps {
  asignacion: AsignacionContratista;
}

export function AsignacionContratistaDetailCard({ asignacion }: AsignacionContratistaDetailCardProps) {
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
          <label>Contratista:</label>
          <p>{asignacion.idContratista || '-'}</p>
        </div>
        <div className="detail-item">
          <label>Fecha de Asignación:</label>
          <p>{asignacion.fechaAsignacion ? new Date(asignacion.fechaAsignacion).toLocaleString() : '-'}</p>
        </div>
        <div className="detail-item">
          <label>Asignada por Contratista:</label>
          <p>{asignacion.asignadaPorContratista ? 'Sí' : 'No'}</p>
        </div>
        <div className="detail-item full-width">
          <label>Observaciones:</label>
          <p>{asignacion.observaciones || 'Sin observaciones'}</p>
        </div>
      </div>
    </Card>
  );
}
