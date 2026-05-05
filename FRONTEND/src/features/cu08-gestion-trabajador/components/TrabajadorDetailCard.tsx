import type { ReactNode } from 'react';
import { Card, Badge } from '../../../shared/components';
import type { Trabajador } from '../types/trabajador.types';

interface TrabajadorDetailCardProps {
  trabajador: Trabajador;
}

function DetailRow({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value || '—'}</span>
    </div>
  );
}

export function TrabajadorDetailCard({ trabajador }: TrabajadorDetailCardProps) {
  return (
    <Card 
      title={`${trabajador.nombres} ${trabajador.apellidos || ''}`} 
      subtitle={`CI: ${trabajador.ci}`}
    >
      <div className="detail-grid">
        <DetailRow label="Ocupación" value={<Badge variant="info">{trabajador.ocupacion}</Badge>} />
        <DetailRow label="Estado" value={
          <Badge variant={trabajador.activo ? 'success' : 'danger'}>
            {trabajador.activo ? 'ACTIVO' : 'INACTIVO'}
          </Badge>
        } />
        <DetailRow label="Correo" value={trabajador.correo} />
        <DetailRow label="Teléfono" value={trabajador.telefono} />
        <DetailRow label="Tarifa por Hora" value={trabajador.tarifaHora ? `$${trabajador.tarifaHora.toFixed(2)}` : undefined} />
        <DetailRow label="Fecha Registro" value={trabajador.fechaRegistro ? new Date(trabajador.fechaRegistro).toLocaleDateString('es-VE') : undefined} />
        
        <div className="detail-section">
          <h4 className="section-title">Dirección de Domicilio</h4>
          <p className="section-content">{trabajador.direccion || 'No registrada.'}</p>
        </div>
      </div>
    </Card>
  );
}
