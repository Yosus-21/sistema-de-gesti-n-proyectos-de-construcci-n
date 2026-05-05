import { Table, Button, Badge } from '../../../shared/components';
import type { AsignacionMaterialIa, EstadoAsignacionIa } from '../types/asignacion-material-ia.types';

interface AsignacionesMaterialIaTableProps {
  asignaciones: AsignacionMaterialIa[];
  onView: (id: number) => void;
  onAdjust: (id: number) => void;
  onConfirm: (id: number) => void;
  onValidate: (item: AsignacionMaterialIa) => void;
}

const ESTADO_VARIANTS: Record<EstadoAsignacionIa, 'warning' | 'success' | 'danger' | 'info'> = {
  PENDIENTE: 'warning',
  CONFIRMADA: 'success',
  CANCELADA: 'danger',
  AJUSTADA: 'info',
};

export function AsignacionesMaterialIaTable({ 
  asignaciones, 
  onView, 
  onAdjust, 
  onConfirm, 
  onValidate 
}: AsignacionesMaterialIaTableProps) {
  return (
    <Table
      data={asignaciones}
      columns={[
        { header: 'ID', key: 'idAsignacionMaterial' },
        { 
          header: 'Tarea/Material', 
          key: 'idTarea',
          render: (item) => (
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.material?.nombre || `Mat ID: ${item.idMaterial}`}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Tarea ID: {item.idTarea}</div>
            </div>
          )
        },
        { 
          header: 'Cant. Asignada', 
          key: 'cantidadAsignada',
          render: (item) => item.cantidadAsignada?.toLocaleString() || '-'
        },
        { 
          header: 'Costo Est.', 
          key: 'costoEstimado',
          render: (item) => item.costoEstimado ? `$${item.costoEstimado.toLocaleString()}` : '-'
        },
        { 
          header: 'Estado', 
          key: 'estadoAsignacion',
          render: (item) => (
            <Badge variant={ESTADO_VARIANTS[item.estadoAsignacion || 'PENDIENTE']}>
              {item.estadoAsignacion || 'PENDIENTE'}
            </Badge>
          )
        },
        { 
          header: 'IA', 
          key: 'generadaPorIa',
          render: (item) => (
            <Badge variant={item.generadaPorIa ? 'info' : 'neutral'}>
              {item.generadaPorIa ? 'IA' : 'Heurística'}
            </Badge>
          )
        },
      ]}
      getRowKey={(a) => a.idAsignacionMaterial}
      actions={(a) => (
        <div className="table-actions">
          <Button size="sm" variant="ghost" onClick={() => onView(a.idAsignacionMaterial)}>Ver</Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onAdjust(a.idAsignacionMaterial)}
            disabled={a.estadoAsignacion === 'CONFIRMADA'}
          >
            Ajustar
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => onConfirm(a.idAsignacionMaterial)}
            disabled={a.estadoAsignacion === 'CONFIRMADA'}
          >
            Confirmar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onValidate(a)}>Validar</Button>
        </div>
      )}
    />
  );
}
