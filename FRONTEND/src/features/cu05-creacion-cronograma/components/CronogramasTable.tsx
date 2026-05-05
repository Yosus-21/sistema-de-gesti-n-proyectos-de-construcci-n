import { useNavigate } from 'react-router-dom';
import { Table, Badge, Button } from '../../../shared/components';
import type { Column } from '../../../shared/components';
import { EstadoCronograma } from '../types/cronograma.types';
import type { Cronograma } from '../types/cronograma.types';

interface CronogramasTableProps {
  cronogramas: Cronograma[];
  loading: boolean;
  onReplanificar: (cronograma: Cronograma) => void;
}

export function CronogramasTable({ cronogramas, loading, onReplanificar }: CronogramasTableProps) {
  const navigate = useNavigate();

  const columns: Column<Cronograma>[] = [
    {
      key: 'proyecto',
      header: 'Proyecto',
      render: (c) => c.proyecto?.nombre ?? `ID: ${c.idProyecto}`,
    },
    {
      key: 'fechaCreacion',
      header: 'Creado el',
      render: (c) => c.fechaCreacion ? new Date(c.fechaCreacion).toLocaleDateString('es-VE') : '—',
    },
    {
      key: 'fechaInicio',
      header: 'Inicio',
      render: (c) => c.fechaInicio ? new Date(c.fechaInicio).toLocaleDateString('es-VE') : '—',
    },
    {
      key: 'fechaFin',
      header: 'Fin',
      render: (c) => c.fechaFin ? new Date(c.fechaFin).toLocaleDateString('es-VE') : '—',
    },
    {
      key: 'estadoCronograma',
      header: 'Estado',
      render: (c) => {
        const variants: Record<EstadoCronograma, 'info' | 'success' | 'warning' | 'danger'> = {
          [EstadoCronograma.ACTIVO]: 'success',
          [EstadoCronograma.REPLANIFICADO]: 'warning',
          [EstadoCronograma.FINALIZADO]: 'info',
          [EstadoCronograma.CANCELADO]: 'danger',
        };
        return <Badge variant={variants[c.estadoCronograma]}>{c.estadoCronograma}</Badge>;
      },
    },
    {
      key: 'fechaUltimaModificacion',
      header: 'Últ. Modif.',
      render: (c) => c.fechaUltimaModificacion ? new Date(c.fechaUltimaModificacion).toLocaleDateString('es-VE') : '—',
    },
  ];

  return (
    <Table<Cronograma>
      columns={columns}
      data={cronogramas}
      getRowKey={(c) => c.idCronograma}
      loading={loading}
      emptyMessage="No se encontraron cronogramas"
      actions={(c) => (
        <div className="row-actions">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/cronogramas/${c.idCronograma}`)}
          >
            Ver
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onReplanificar(c)}
          >
            Replanificar
          </Button>
        </div>
      )}
    />
  );
}
