import { Card, Badge, Table } from '../../../shared/components';
import type { OrdenCompra, EstadoOrden } from '../types/orden-compra.types';

interface OrdenCompraDetailCardProps {
  orden: OrdenCompra;
}

const ESTADO_VARIANTS: Record<EstadoOrden, 'info' | 'warning' | 'success' | 'danger'> = {
  BORRADOR: 'info',
  EMITIDA: 'warning',
  RECIBIDA: 'success',
  CANCELADA: 'danger',
};

export function OrdenCompraDetailCard({ orden }: OrdenCompraDetailCardProps) {
  return (
    <div className="orden-compra-detail">
      <Card title={`Orden de Compra #${orden.idOrdenCompra}`} className="orden-detail-card">
        <div className="detail-grid">
          <div className="detail-item">
            <label>Proveedor</label>
            <span>{orden.proveedor?.nombre || `ID: ${orden.idProveedor}`}</span>
          </div>
          <div className="detail-item">
            <label>Estado</label>
            <Badge variant={ESTADO_VARIANTS[orden.estadoOrden || 'BORRADOR']}>
              {orden.estadoOrden || 'BORRADOR'}
            </Badge>
          </div>
          <div className="detail-item">
            <label>Fecha Emisión</label>
            <span>{orden.fechaEmision ? new Date(orden.fechaEmision).toLocaleDateString() : '-'}</span>
          </div>
          <div className="detail-item">
            <label>Entrega Estimada</label>
            <span>{orden.fechaEntregaEstimada ? new Date(orden.fechaEntregaEstimada).toLocaleDateString() : '-'}</span>
          </div>
          <div className="detail-item">
            <label>Monto Total</label>
            <span className="total-amount">${(orden.montoTotal || 0).toLocaleString()}</span>
          </div>
        </div>
        
        {orden.observaciones && (
          <div className="detail-section">
            <label>Observaciones</label>
            <p>{orden.observaciones}</p>
          </div>
        )}
      </Card>

      <Card title="Líneas de la Orden" className="orden-lines-card">
        {orden.lineas && orden.lineas.length > 0 ? (
          <Table
            data={orden.lineas}
            columns={[
              { 
                header: 'Material', 
                key: 'idMaterial',
                render: (item) => item.material?.nombre || `ID: ${item.idMaterial}`
              },
              { header: 'Cant. Solicitada', key: 'cantidadSolicitada' },
              { 
                header: 'Precio Unit.', 
                key: 'precioUnitarioAcordado',
                render: (item) => `$${(item.precioUnitarioAcordado || 0).toLocaleString()}`
              },
              { 
                header: 'Subtotal', 
                key: 'subtotal',
                render: (item) => `$${((item.cantidadSolicitada || 0) * (item.precioUnitarioAcordado || 0)).toLocaleString()}`
              },
              { 
                header: 'Estado Línea', 
                key: 'estadoLinea',
                render: (item) => <Badge variant="neutral">{item.estadoLinea || 'PENDIENTE'}</Badge>
              }
            ]}
            getRowKey={(l) => l.idLineaOrdenCompra ?? l.idMaterial}
          />
        ) : (
          <p className="empty-message">No hay líneas registradas en esta orden.</p>
        )}
      </Card>
    </div>
  );
}
