import { useNavigate } from 'react-router-dom';
import { Table, Badge, Button } from '../../../shared/components';
import type { Column } from '../../../shared/components';
import { EstadoProyecto, type Proyecto } from '../types/proyecto.types';

interface ProyectosTableProps {
  proyectos: Proyecto[];
  loading: boolean;
  onCambiarEstado: (proyecto: Proyecto) => void;
}

export function ProyectosTable({ proyectos, loading, onCambiarEstado }: ProyectosTableProps) {
  const navigate = useNavigate();

  const columns: Column<Proyecto>[] = [
    { key: 'nombre', header: 'Proyecto' },
    {
      key: 'cliente',
      header: 'Cliente',
      render: (p) => p.cliente?.nombre ?? `ID: ${p.idCliente}`,
    },
    {
      key: 'ubicacion',
      header: 'Ubicación',
      render: (p) => p.ubicacion ?? <span className="text-muted">—</span>,
    },
    {
      key: 'presupuesto',
      header: 'Presupuesto',
      render: (p) => p.presupuesto !== undefined ? `$${p.presupuesto.toLocaleString()}` : <span className="text-muted">—</span>,
    },
    {
      key: 'fechaInicio',
      header: 'Inicio',
      render: (p) => new Date(p.fechaInicio).toLocaleDateString('es-VE'),
    },
    {
      key: 'estadoProyecto',
      header: 'Estado',
      render: (p) => {
        const variants: Record<EstadoProyecto, 'info' | 'success' | 'warning' | 'danger'> = {
          [EstadoProyecto.PLANIFICACION]: 'info',
          [EstadoProyecto.EN_PROGRESO]: 'warning',
          [EstadoProyecto.FINALIZADO]: 'success',
          [EstadoProyecto.CANCELADO]: 'danger',
        };
        return <Badge variant={variants[p.estadoProyecto]}>{p.estadoProyecto.replace('_', ' ')}</Badge>;
      },
    },
  ];

  return (
    <Table<Proyecto>
      columns={columns}
      data={proyectos}
      getRowKey={(p) => p.idProyecto}
      loading={loading}
      emptyMessage="No se encontraron proyectos"
      actions={(p) => (
        <div className="row-actions">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/proyectos/${p.idProyecto}`)}
          >
            Ver
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onCambiarEstado(p)}
          >
            Estado
          </Button>
        </div>
      )}
    />
  );
}
