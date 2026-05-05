import { Card, Badge } from '../../../shared/components';
import type { Seguimiento } from '../types/seguimiento.types';

interface SeguimientoDetailCardProps {
  seguimiento: Seguimiento;
}

export function SeguimientoDetailCard({ seguimiento }: SeguimientoDetailCardProps) {
  return (
    <Card className="seguimiento-detail-card">
      <div className="detail-grid">
        <div className="detail-item">
          <label>ID Seguimiento</label>
          <span>{seguimiento.idSeguimiento}</span>
        </div>
        <div className="detail-item">
          <label>Tarea</label>
          <span>Tarea #{seguimiento.idTarea}</span>
        </div>
        <div className="detail-item">
          <label>Fecha de Seguimiento</label>
          <span>{new Date(seguimiento.fechaSeguimiento).toLocaleDateString('es-VE')}</span>
        </div>
        <div className="detail-item">
          <label>Porcentaje de Avance</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Badge variant="info">{seguimiento.porcentajeAvance}%</Badge>
            <div className="progress-bar" style={{ flex: 1, background: '#eee', height: '12px', borderRadius: '6px' }}>
              <div style={{ width: `${seguimiento.porcentajeAvance}%`, background: 'var(--color-primary)', height: '100%', borderRadius: '6px' }} />
            </div>
          </div>
        </div>
        <div className="detail-item">
          <label>Estado de Tarea</label>
          <Badge variant={seguimiento.estadoTarea === 'FINALIZADA' ? 'success' : 'info'}>
            {seguimiento.estadoTarea || 'PÉNDIENTE'}
          </Badge>
        </div>
        {seguimiento.fechaInicioReal && (
          <div className="detail-item">
            <label>Fecha Inicio Real</label>
            <span>{new Date(seguimiento.fechaInicioReal).toLocaleDateString('es-VE')}</span>
          </div>
        )}
        {seguimiento.fechaFinReal && (
          <div className="detail-item">
            <label>Fecha Fin Real</label>
            <span>{new Date(seguimiento.fechaFinReal).toLocaleDateString('es-VE')}</span>
          </div>
        )}
      </div>
      {seguimiento.observaciones && (
        <div className="detail-section" style={{ marginTop: '1.5rem' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Observaciones</label>
          <p style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px', fontStyle: 'italic' }}>
            {seguimiento.observaciones}
          </p>
        </div>
      )}
    </Card>
  );
}
