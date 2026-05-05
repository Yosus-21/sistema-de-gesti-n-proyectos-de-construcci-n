import { Card, Badge } from '../../../shared/components';
import type { EntregaMaterial, EstadoEntrega } from '../types/entrega-material.types';

interface EntregaMaterialDetailCardProps {
  entrega: EntregaMaterial;
}

const ESTADO_VARIANTS: Record<EstadoEntrega, 'warning' | 'success'> = {
  REGISTRADA: 'warning',
  RECIBIDA: 'success',
};

export function EntregaMaterialDetailCard({ entrega }: EntregaMaterialDetailCardProps) {
  return (
    <Card title={`Entrega de Material #${entrega.idEntregaMaterial}`} className="entrega-detail-card">
      <div className="detail-grid">
        <div className="detail-item">
          <label>Orden de Compra</label>
          <span>Orden #{entrega.idOrdenCompra}</span>
        </div>
        <div className="detail-item">
          <label>Material</label>
          <span>{entrega.material?.nombre || `ID: ${entrega.idMaterial}`}</span>
        </div>
        <div className="detail-item">
          <label>Estado</label>
          <Badge variant={ESTADO_VARIANTS[entrega.estadoEntrega || 'REGISTRADA']}>
            {entrega.estadoEntrega || 'REGISTRADA'}
          </Badge>
        </div>
        <div className="detail-item">
          <label>Cantidad Entregada</label>
          <span className="highlight-value">{entrega.cantidadEntregada.toLocaleString()}</span>
        </div>
        <div className="detail-item">
          <label>Fecha Entrega</label>
          <span>{entrega.fechaEntrega ? new Date(entrega.fechaEntrega).toLocaleDateString() : '-'}</span>
        </div>
      </div>
      
      {entrega.observaciones && (
        <div className="detail-section">
          <label>Observaciones</label>
          <p>{entrega.observaciones}</p>
        </div>
      )}
    </Card>
  );
}
