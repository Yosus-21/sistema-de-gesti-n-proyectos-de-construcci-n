import { Table, Badge, Button } from '../../../shared/components';
import type { AsignacionObraBruta } from '../types/asignacion-obra-bruta.types';

interface AsignacionesObraBrutaTableProps {
  data: AsignacionObraBruta[];
  onVer: (id: number) => void;
  onEditar: (id: number) => void;
  onCancelar: (id: number) => void;
}

export function AsignacionesObraBrutaTable({ data, onVer, onEditar, onCancelar }: AsignacionesObraBrutaTableProps) {
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
    { key: 'tarea', header: 'Tarea', render: (row: AsignacionObraBruta) => row.tarea?.nombre || row.idTarea },
    { key: 'trabajador', header: 'Trabajador', render: (row: AsignacionObraBruta) => row.trabajador ? `${row.trabajador.nombres} ${row.trabajador.apellidos || ''}` : row.idTrabajador },
    { key: 'estadoAsignacion', header: 'Estado', render: (row: AsignacionObraBruta) => <Badge variant={getBadgeVariant(row.estadoAsignacion)}>{row.estadoAsignacion}</Badge> },
    { key: 'fechaAsignacion', header: 'Fecha', render: (row: AsignacionObraBruta) => row.fechaAsignacion ? new Date(row.fechaAsignacion).toLocaleDateString() : '-' },
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
