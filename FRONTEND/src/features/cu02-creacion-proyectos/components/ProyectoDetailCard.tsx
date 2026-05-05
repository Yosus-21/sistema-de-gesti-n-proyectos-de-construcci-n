import type { ReactNode } from 'react';
import { Card, Badge } from '../../../shared/components';
import { EstadoProyecto, type Proyecto } from '../types/proyecto.types';

interface ProyectoDetailCardProps {
  proyecto: Proyecto;
}

function DetailRow({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value !== undefined && value !== null && value !== '' ? value : '—'}</span>
    </div>
  );
}

export function ProyectoDetailCard({ proyecto }: ProyectoDetailCardProps) {
  const variants: Record<EstadoProyecto, 'info' | 'success' | 'warning' | 'danger'> = {
    [EstadoProyecto.PLANIFICACION]: 'info',
    [EstadoProyecto.EN_PROGRESO]: 'warning',
    [EstadoProyecto.FINALIZADO]: 'success',
    [EstadoProyecto.CANCELADO]: 'danger',
  };

  return (
    <Card title={proyecto.nombre} subtitle={`ID Proyecto: ${proyecto.idProyecto}`}>
      <div className="detail-grid">
        <DetailRow label="Cliente" value={proyecto.cliente?.nombre ?? `ID: ${proyecto.idCliente}`} />
        <DetailRow label="Estado" value={
          <Badge variant={variants[proyecto.estadoProyecto]}>
            {proyecto.estadoProyecto.replace('_', ' ')}
          </Badge>
        } />
        <DetailRow label="Ubicación" value={proyecto.ubicacion} />
        <DetailRow label="Presupuesto" value={proyecto.presupuesto ? `$${proyecto.presupuesto.toLocaleString()}` : undefined} />
        <DetailRow label="Fecha Inicio" value={new Date(proyecto.fechaInicio).toLocaleDateString('es-VE')} />
        <DetailRow label="Fin Estimado" value={new Date(proyecto.fechaFinEstimada).toLocaleDateString('es-VE')} />
        
        <div className="detail-section">
          <h4 className="section-title">Descripción</h4>
          <p className="section-content">{proyecto.descripcion ?? 'Sin descripción.'}</p>
        </div>

        <div className="detail-section">
          <h4 className="section-title">Especificaciones Técnicas</h4>
          <p className="section-content">{proyecto.especificacionesTecnicas ?? 'Sin especificaciones.'}</p>
        </div>
      </div>
    </Card>
  );
}
