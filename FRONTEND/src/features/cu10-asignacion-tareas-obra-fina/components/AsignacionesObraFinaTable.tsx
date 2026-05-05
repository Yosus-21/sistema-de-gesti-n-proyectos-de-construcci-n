import { Table, Badge, Button } from '../../../shared/components';
import type { AsignacionObraFina } from '../types/asignacion-obra-fina.types';

interface AsignacionesObraFinaTableProps {
  data: AsignacionObraFina[];
  onVer: (id: number) => void;
  onEditar: (id: number) => void;
  onCancelar: (id: number) => void;
}

export function AsignacionesObraFinaTable({ data, onVer, onEditar, onCancelar }: AsignacionesObraFinaTableProps) {
  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADA': return 'success';
      case 'PENDIENTE': return 'warning';
      case 'CANCELADA': return 'danger';
      case 'REASIGNADA': return 'info';
      default: return 'neutral';
    }
  };

  const columns = [
    { key: 'idAsignacionTarea', header: 'ID' },
    { key: 'tarea', header: 'Tarea', render: (row: AsignacionObraFina) => row.tarea?.nombre || row.idTarea },
    { key: 'trabajador', header: 'Trabajador', render: (row: AsignacionObraFina) => row.trabajador ? `${row.trabajador.nombres} ${row.trabajador.apellidos || ''}` : row.idTrabajador },
    { key: 'estadoAsignacion', header: 'Estado', render: (row: AsignacionObraFina) => <Badge variant={getBadgeVariant(row.estadoAsignacion)}>{row.estadoAsignacion}</Badge> },
    { key: 'fechaAsignacion', header: 'Fecha', render: (row: AsignacionObraFina) => row.fechaAsignacion ? new Date(row.fechaAsignacion).toLocaleDateString() : '-' },
  ];

  return (
    <Table 
      data={data} 
      columns={columns} 
      getRowKey={(item) => item.idAsignacionTarea}
      actions={(row) => (
        <div className="table-actions">
          <Button variant="ghost" size="sm" onClick={() => onVer(row.idAsignacionTarea)}>Ver</Button>
          {row.estadoAsignacion !== 'CANCELADA' && (
            <>
              <Button variant="ghost" size="sm" onClick={() => onEditar(row.idAsignacionTarea)}>Editar</Button>
              <Button variant="danger" size="sm" onClick={() => onCancelar(row.idAsignacionTarea)}>Cancelar</Button>
            </>
          )}
        </div>
      )}
    />
  );
}
