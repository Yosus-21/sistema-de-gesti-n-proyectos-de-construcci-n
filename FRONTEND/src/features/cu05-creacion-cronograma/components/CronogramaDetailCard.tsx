import type { ReactNode } from 'react';
import { Card, Badge } from '../../../shared/components';
import { EstadoCronograma } from '../types/cronograma.types';
import type { Cronograma } from '../types/cronograma.types';

interface CronogramaDetailCardProps {
  cronograma: Cronograma;
}

function DetailRow({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value !== undefined && value !== null && value !== '' ? value : '—'}</span>
    </div>
  );
}

export function CronogramaDetailCard({ cronograma }: CronogramaDetailCardProps) {
  const variants: Record<EstadoCronograma, 'info' | 'success' | 'warning' | 'danger'> = {
    [EstadoCronograma.ACTIVO]: 'success',
    [EstadoCronograma.REPLANIFICADO]: 'warning',
    [EstadoCronograma.FINALIZADO]: 'info',
    [EstadoCronograma.CANCELADO]: 'danger',
  };

  const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString('es-VE') : '—';

  return (
    <Card title={`Cronograma #${cronograma.idCronograma}`} subtitle={`Proyecto: ${cronograma.proyecto?.nombre ?? cronograma.idProyecto}`}>
      <div className="detail-grid">
        <DetailRow label="Estado" value={
          <Badge variant={variants[cronograma.estadoCronograma]}>
            {cronograma.estadoCronograma}
          </Badge>
        } />
        <DetailRow label="Fecha Creación" value={formatDate(cronograma.fechaCreacion)} />
        <DetailRow label="Fecha Inicio Real" value={formatDate(cronograma.fechaInicio)} />
        <DetailRow label="Fecha Fin Real" value={formatDate(cronograma.fechaFin)} />
        <DetailRow label="Inicio Planificado" value={formatDate(cronograma.fechaInicioPlanificada)} />
        <DetailRow label="Fin Planificado" value={formatDate(cronograma.fechaFinPlanificada)} />
        <DetailRow label="Última Modificación" value={formatDate(cronograma.fechaUltimaModificacion)} />
        
        <div className="detail-section">
          <h4 className="section-title">Acciones ante Retraso</h4>
          <p className="section-content">{cronograma.accionesAnteRetraso ?? 'No se definieron acciones.'}</p>
        </div>

        {cronograma.motivoReplanificacion && (
          <div className="detail-section">
            <h4 className="section-title">Motivo de Replanificación</h4>
            <p className="section-content">{cronograma.motivoReplanificacion}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
