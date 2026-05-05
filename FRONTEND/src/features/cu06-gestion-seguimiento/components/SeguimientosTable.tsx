import { Table, Badge, Button } from '../../../shared/components';
import type { Column } from '../../../shared/components';
import type { Seguimiento } from '../types/seguimiento.types';

interface SeguimientosTableProps {
  seguimientos: Seguimiento[];
  loading: boolean;
  onView: (s: Seguimiento) => void;
  onEdit: (s: Seguimiento) => void;
  onCalcularDesviacion: (s: Seguimiento) => void;
}

export function SeguimientosTable({ 
  seguimientos, 
  loading, 
  onView, 
  onEdit, 
  onCalcularDesviacion 
}: SeguimientosTableProps) {
  const columns: Column<Seguimiento>[] = [
    {
      key: 'idSeguimiento',
      header: 'ID',
    },
    {
      key: 'idTarea',
      header: 'Tarea',
      render: (s) => `Tarea #${s.idTarea}`,
    },
    {
      key: 'fechaSeguimiento',
      header: 'Fecha',
      render: (s) => new Date(s.fechaSeguimiento).toLocaleDateString('es-VE'),
    },
    {
      key: 'porcentajeAvance',
      header: 'Avance',
      render: (s) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="progress-bar-mini" style={{ width: '60px', background: '#eee', height: '8px', borderRadius: '4px' }}>
            <div style={{ width: `${s.porcentajeAvance}%`, background: 'var(--color-primary)', height: '100%', borderRadius: '4px' }} />
          </div>
          <span>{s.porcentajeAvance}%</span>
        </div>
      ),
    },
    {
      key: 'estadoTarea',
      header: 'Estado Tarea',
      render: (s) => (
        <Badge variant={s.estadoTarea === 'FINALIZADA' ? 'success' : s.estadoTarea === 'EN_PROGRESO' ? 'info' : 'warning'}>
          {s.estadoTarea || 'N/A'}
        </Badge>
      ),
    },
  ];

  return (
    <Table<Seguimiento>
      columns={columns}
      data={seguimientos}
      getRowKey={(s) => s.idSeguimiento}
      loading={loading}
      emptyMessage="No se encontraron seguimientos"
      actions={(s) => (
        <div className="row-actions">
          <Button size="sm" variant="ghost" onClick={() => onView(s)}>
            Ver
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(s)}>
            Editar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onCalcularDesviacion(s)}>
            Desviación
          </Button>
        </div>
      )}
    />
  );
}
