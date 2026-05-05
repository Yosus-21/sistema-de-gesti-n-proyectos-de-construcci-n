import { Table, Button, Badge } from '../../../shared/components';
import type { Alerta } from '../types/alerta-notificacion.types';

interface AlertasTableProps {
  alertas: Alerta[];
  onView: (id: number) => void;
  onActivar: (id: number) => void;
  onDesactivar: (id: number) => void;
  onNotificar: (id: number) => void;
}

export function AlertasTable({ alertas, onView, onActivar, onDesactivar, onNotificar }: AlertasTableProps) {
  const getEstadoVariant = (estado?: string) => {
    switch (estado) {
      case 'ACTIVA': return 'success';
      case 'INACTIVA': return 'warning';
      case 'NOTIFICADA': return 'info';
      default: return 'neutral';
    }
  };

  return (
    <Table
      data={alertas}
      columns={[
        { header: 'ID', key: 'idAlerta' },
        { header: 'Tipo', key: 'tipoAlerta' },
        { 
          header: 'Estado', 
          key: 'estadoAlerta',
          render: (item) => <Badge variant={getEstadoVariant(item.estadoAlerta)}>{item.estadoAlerta}</Badge>
        },
        { 
          header: 'Destino', 
          key: 'idProyecto',
          render: (item) => {
            if (item.proyecto) return `P: ${item.proyecto.nombre}`;
            if (item.tarea) return `T: ${item.tarea.nombre}`;
            if (item.material) return `M: ${item.material.nombre}`;
            return 'Varios';
          }
        },
        { header: 'Método', key: 'metodoNotificacion' },
        { 
          header: 'Fecha Gen.', 
          key: 'fechaGeneracion',
          render: (item) => item.fechaGeneracion ? new Date(item.fechaGeneracion).toLocaleDateString() : '-'
        },
      ]}
      getRowKey={(item) => item.idAlerta}
      actions={(item) => (
        <div className="table-actions">
          <Button size="sm" variant="ghost" onClick={() => onView(item.idAlerta)}>Ver</Button>
          {item.estadoAlerta === 'INACTIVA' && (
            <Button size="sm" variant="ghost" onClick={() => onActivar(item.idAlerta)}>Activar</Button>
          )}
          {item.estadoAlerta === 'ACTIVA' && (
            <Button size="sm" variant="ghost" onClick={() => onDesactivar(item.idAlerta)}>Desactivar</Button>
          )}
          <Button size="sm" variant="primary" onClick={() => onNotificar(item.idAlerta)}>Notificar</Button>
        </div>
      )}
    />
  );
}
