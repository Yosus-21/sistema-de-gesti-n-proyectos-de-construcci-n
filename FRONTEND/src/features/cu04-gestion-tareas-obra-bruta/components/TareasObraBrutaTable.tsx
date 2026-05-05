import { Table, Badge, Button } from '../../../shared/components';
import type { Column } from '../../../shared/components';
import type { TareaObraBruta } from '../types/tarea-obra-bruta.types';

interface TareasObraBrutaTableProps {
  tareas: TareaObraBruta[];
  loading: boolean;
  onEdit: (tarea: TareaObraBruta) => void;
  onDelete: (tarea: TareaObraBruta) => void;
}

export function TareasObraBrutaTable({ tareas, loading, onEdit, onDelete }: TareasObraBrutaTableProps) {
  const columns: Column<TareaObraBruta>[] = [
    {
      key: 'nombre',
      header: 'Tarea',
    },
    {
      key: 'idProyecto',
      header: 'Proyecto',
      render: (t) => `P-${t.idProyecto}`,
    },
    {
      key: 'fechaInicioPlanificada',
      header: 'Inicio',
      render: (t) => new Date(t.fechaInicioPlanificada).toLocaleDateString('es-VE'),
    },
    {
      key: 'fechaFinPlanificada',
      header: 'Fin',
      render: (t) => new Date(t.fechaFinPlanificada).toLocaleDateString('es-VE'),
    },
    {
      key: 'prioridadTarea',
      header: 'Prioridad',
      render: (t) => {
        const variant = t.prioridadTarea === 'ALTA' ? 'danger' : t.prioridadTarea === 'MEDIA' ? 'warning' : 'info';
        return <Badge variant={variant}>{t.prioridadTarea}</Badge>;
      },
    },
    {
      key: 'perfilRequerido',
      header: 'Perfil',
      render: (t) => <Badge variant="neutral">{t.perfilRequerido}</Badge>,
    },
    {
      key: 'estadoTarea',
      header: 'Estado',
      render: (t) => {
        const variant = t.estadoTarea === 'FINALIZADA' ? 'success' : t.estadoTarea === 'EN_PROGRESO' ? 'info' : 'warning';
        return <Badge variant={variant}>{t.estadoTarea}</Badge>;
      },
    },
  ];

  return (
    <Table<TareaObraBruta>
      columns={columns}
      data={tareas}
      getRowKey={(t) => t.idTarea}
      loading={loading}
      emptyMessage="No se encontraron tareas de obra bruta"
      actions={(t) => (
        <div className="row-actions">
          <Button size="sm" variant="ghost" onClick={() => onEdit(t)}>
            Editar
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(t)} style={{ color: 'var(--color-danger)' }}>
            Eliminar
          </Button>
        </div>
      )}
    />
  );
}
