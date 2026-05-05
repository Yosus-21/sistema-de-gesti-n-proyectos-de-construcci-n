import { useNavigate } from 'react-router-dom';
import { Table, Badge, Button } from '../../../shared/components';
import type { Column } from '../../../shared/components';
import type { Trabajador } from '../types/trabajador.types';

interface TrabajadoresTableProps {
  trabajadores: Trabajador[];
  loading: boolean;
  onEliminar: (trabajador: Trabajador) => void;
  onVerificarDisponibilidad: (trabajador: Trabajador) => void;
}

export function TrabajadoresTable({ 
  trabajadores, 
  loading, 
  onEliminar, 
  onVerificarDisponibilidad 
}: TrabajadoresTableProps) {
  const navigate = useNavigate();

  const columns: Column<Trabajador>[] = [
    {
      key: 'nombres',
      header: 'Nombre Completo',
      render: (t) => `${t.nombres} ${t.apellidos || ''}`,
    },
    {
      key: 'ci',
      header: 'CI',
    },
    {
      key: 'ocupacion',
      header: 'Ocupación',
      render: (t) => <Badge variant="info">{t.ocupacion}</Badge>,
    },
    {
      key: 'tarifaHora',
      header: 'Tarifa/Hora',
      render: (t) => t.tarifaHora ? `$${t.tarifaHora.toFixed(2)}` : '—',
    },
    {
      key: 'activo',
      header: 'Estado',
      render: (t) => (
        <Badge variant={t.activo ? 'success' : 'danger'}>
          {t.activo ? 'ACTIVO' : 'INACTIVO'}
        </Badge>
      ),
    },
  ];

  return (
    <Table<Trabajador>
      columns={columns}
      data={trabajadores}
      getRowKey={(t) => t.idTrabajador}
      loading={loading}
      emptyMessage="No se encontraron trabajadores registrados"
      actions={(t) => (
        <div className="row-actions">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/trabajadores/${t.idTrabajador}`)}
            title="Ver detalle"
          >
            Ver
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/trabajadores/${t.idTrabajador}/editar`)}
            title="Editar"
          >
            Editar
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onVerificarDisponibilidad(t)}
            title="Verificar disponibilidad"
          >
            Disp.
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onEliminar(t)}
            title="Eliminar"
          >
            Eliminar
          </Button>
        </div>
      )}
    />
  );
}
