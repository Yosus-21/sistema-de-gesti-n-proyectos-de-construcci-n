import { Table, Badge, Button } from '../../../shared/components';
import type { AsignacionContratista } from '../types/asignacion-contratista.types';

interface AsignacionesContratistaTableProps {
  data: AsignacionContratista[];
  onVer: (id: number) => void;
  onReasignar: (id: number) => void;
  onCancelar: (id: number) => void;
}

export function AsignacionesContratistaTable({ data, onVer, onReasignar, onCancelar }: AsignacionesContratistaTableProps) {
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
    { key: 'tarea', header: 'Tarea', render: (row: AsignacionContratista) => row.tarea?.nombre || row.idTarea },
    { key: 'trabajador', header: 'Trabajador', render: (row: AsignacionContratista) => row.trabajador ? `${row.trabajador.nombres} ${row.trabajador.apellidos || ''}` : row.idTrabajador },
    { key: 'estadoAsignacion', header: 'Estado', render: (row: AsignacionContratista) => <Badge variant={getBadgeVariant(row.estadoAsignacion)}>{row.estadoAsignacion}</Badge> },
    { key: 'idContratista', header: 'Contratista', render: (row: AsignacionContratista) => row.idContratista || '-' },
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
              <Button variant="ghost" size="sm" onClick={() => onReasignar(row.idAsignacionTarea)}>Reasignar</Button>
              <Button variant="danger" size="sm" onClick={() => onCancelar(row.idAsignacionTarea)}>Cancelar</Button>
            </>
          )}
        </div>
      )}
    />
  );
}
