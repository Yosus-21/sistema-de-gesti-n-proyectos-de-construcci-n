import { Table, Button, Badge } from '../../../shared/components';
import type { PronosticoMaterialIa } from '../types/pronostico-material-ia.types';

interface PronosticosMaterialIaTableProps {
  pronosticos: PronosticoMaterialIa[];
  onView: (id: number) => void;
  onAdjust: (id: number) => void;
  onConfirm: (id: number) => void;
  onCheckConfidence: (id: number) => void;
}

export function PronosticosMaterialIaTable({ 
  pronosticos, 
  onView, 
  onAdjust, 
  onConfirm, 
  onCheckConfidence 
}: PronosticosMaterialIaTableProps) {
  return (
    <Table
      data={pronosticos}
      columns={[
        { header: 'ID', key: 'idPronosticoMaterial' },
        { 
          header: 'Proyecto', 
          key: 'idProyecto',
          render: (item) => item.proyecto?.nombre || `ID: ${item.idProyecto}`
        },
        { 
          header: 'Material', 
          key: 'idMaterial',
          render: (item) => item.material?.nombre || `ID: ${item.idMaterial}`
        },
        { header: 'Stock Mín.', key: 'stockMinimo' },
        { header: 'Stock Máx.', key: 'stockMaximo' },
        { 
          header: 'Confianza', 
          key: 'nivelConfianza',
          render: (item) => {
            const val = item.nivelConfianza || 0;
            const variant = val >= 80 ? 'success' : val >= 50 ? 'warning' : 'danger';
            return <Badge variant={variant}>{val}%</Badge>;
          }
        },
        { 
          header: 'Fecha', 
          key: 'fechaGeneracion',
          render: (item) => item.fechaGeneracion ? new Date(item.fechaGeneracion).toLocaleDateString() : '-'
        },
      ]}
      getRowKey={(p) => p.idPronosticoMaterial}
      actions={(p) => (
        <div className="table-actions">
          <Button size="sm" variant="ghost" onClick={() => onView(p.idPronosticoMaterial)}>Ver</Button>
          <Button size="sm" variant="ghost" onClick={() => onAdjust(p.idPronosticoMaterial)}>Ajustar</Button>
          <Button size="sm" variant="ghost" onClick={() => onConfirm(p.idPronosticoMaterial)}>Confirmar</Button>
          <Button size="sm" variant="ghost" onClick={() => onCheckConfidence(p.idPronosticoMaterial)}>Confianza</Button>
        </div>
      )}
    />
  );
}
