import { Table, Button, Badge } from '../../../shared/components';
import type { EntregaMaterial, EstadoEntrega } from '../types/entrega-material.types';

interface EntregasMaterialesTableProps {
  entregas: EntregaMaterial[];
  onView: (id: number) => void;
  onConfirm: (id: number) => void;
  onVerify: (idEntrega: number, idOrden: number) => void;
}

const ESTADO_VARIANTS: Record<EstadoEntrega, 'warning' | 'success'> = {
  REGISTRADA: 'warning',
  RECIBIDA: 'success',
};

export function EntregasMaterialesTable({ 
  entregas, 
  onView, 
  onConfirm, 
  onVerify 
}: EntregasMaterialesTableProps) {
  return (
    <Table
      data={entregas}
      columns={[
        { header: 'ID', key: 'idEntregaMaterial' },
        { 
          header: 'Orden #', 
          key: 'idOrdenCompra',
          render: (item) => `Orden #${item.idOrdenCompra}`
        },
        { 
          header: 'Material', 
          key: 'idMaterial',
          render: (item) => item.material?.nombre || `ID: ${item.idMaterial}`
        },
        { 
          header: 'Cantidad', 
          key: 'cantidadEntregada',
          render: (item) => item.cantidadEntregada.toLocaleString()
        },
        { 
          header: 'Fecha', 
          key: 'fechaEntrega',
          render: (item) => item.fechaEntrega ? new Date(item.fechaEntrega).toLocaleDateString() : '-'
        },
        { 
          header: 'Estado', 
          key: 'estadoEntrega',
          render: (item) => (
            <Badge variant={ESTADO_VARIANTS[item.estadoEntrega || 'REGISTRADA']}>
              {item.estadoEntrega || 'REGISTRADA'}
            </Badge>
          )
        },
      ]}
      getRowKey={(e) => e.idEntregaMaterial}
      actions={(e) => (
        <div className="table-actions">
          <Button size="sm" variant="ghost" onClick={() => onView(e.idEntregaMaterial)}>Ver</Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onConfirm(e.idEntregaMaterial)}
            disabled={e.estadoEntrega === 'RECIBIDA'}
          >
            Confirmar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onVerify(e.idEntregaMaterial, e.idOrdenCompra)}>Verificar</Button>
        </div>
      )}
    />
  );
}
