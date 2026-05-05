import { Table, Button, Badge } from '../../../shared/components';
import type { OrdenCompra, EstadoOrden } from '../types/orden-compra.types';

interface OrdenesCompraTableProps {
  ordenes: OrdenCompra[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onAddLine: (id: number) => void;
  onChangeStatus: (id: number) => void;
  onCalculateTotal: (id: number) => void;
}

const ESTADO_VARIANTS: Record<EstadoOrden, 'info' | 'warning' | 'success' | 'danger'> = {
  BORRADOR: 'info',
  EMITIDA: 'warning',
  RECIBIDA: 'success',
  CANCELADA: 'danger',
};

export function OrdenesCompraTable({ 
  ordenes, 
  onView, 
  onEdit, 
  onAddLine, 
  onChangeStatus, 
  onCalculateTotal 
}: OrdenesCompraTableProps) {
  return (
    <Table
      data={ordenes}
      columns={[
        { header: 'ID', key: 'idOrdenCompra' },
        { 
          header: 'Proveedor', 
          key: 'idProveedor',
          render: (item) => item.proveedor?.nombre || `ID: ${item.idProveedor}`
        },
        { 
          header: 'Emisión', 
          key: 'fechaEmision',
          render: (item) => item.fechaEmision ? new Date(item.fechaEmision).toLocaleDateString() : '-'
        },
        { 
          header: 'Entrega Est.', 
          key: 'fechaEntregaEstimada',
          render: (item) => item.fechaEntregaEstimada ? new Date(item.fechaEntregaEstimada).toLocaleDateString() : '-'
        },
        { 
          header: 'Estado', 
          key: 'estadoOrden',
          render: (item) => (
            <Badge variant={ESTADO_VARIANTS[item.estadoOrden || 'BORRADOR']}>
              {item.estadoOrden || 'BORRADOR'}
            </Badge>
          )
        },
        { 
          header: 'Monto Total', 
          key: 'montoTotal',
          render: (item) => `$${(item.montoTotal || 0).toLocaleString()}`
        },
      ]}
      getRowKey={(o) => o.idOrdenCompra}
      actions={(o) => (
        <div className="table-actions">
          <Button size="sm" variant="ghost" onClick={() => onView(o.idOrdenCompra)}>Ver</Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(o.idOrdenCompra)}>Editar</Button>
          <Button size="sm" variant="ghost" onClick={() => onAddLine(o.idOrdenCompra)}>+ Línea</Button>
          <Button size="sm" variant="ghost" onClick={() => onChangeStatus(o.idOrdenCompra)}>Estado</Button>
          <Button size="sm" variant="ghost" onClick={() => onCalculateTotal(o.idOrdenCompra)}>Monto</Button>
        </div>
      )}
    />
  );
}
