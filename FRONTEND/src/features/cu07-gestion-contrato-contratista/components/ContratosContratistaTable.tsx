import { Table, Badge, Button } from '../../../shared/components';
import type { ContratoContratista } from '../types/contrato-contratista.types';
import type { Column } from '../../../shared/components/Table/Table';

interface ContratosContratistaTableProps {
  contratos: ContratoContratista[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onCalcularCosto: (id: number) => void;
  onValidarVigencia: (id: number) => void;
}

export function ContratosContratistaTable({ 
  contratos, 
  onView, 
  onEdit, 
  onCalcularCosto, 
  onValidarVigencia 
}: ContratosContratistaTableProps) {
  const columns: Column<ContratoContratista>[] = [
    { key: 'idContrato', header: 'ID', render: (c) => `#${c.idContrato}` },
    { key: 'idProyecto', header: 'Proyecto', render: (c) => c.proyecto?.nombre || `P-${c.idProyecto}` },
    { key: 'idContratista', header: 'Contratista', render: (c) => c.contratista?.nombreEmpresa || `C-${c.idContratista}` },
    { key: 'fechaInicio', header: 'Inicio', render: (c) => new Date(c.fechaInicio).toLocaleDateString() },
    { key: 'fechaFin', header: 'Fin', render: (c) => new Date(c.fechaFin).toLocaleDateString() },
    { key: 'costoTotal', header: 'Costo Total', render: (c) => `$${c.costoTotal.toLocaleString()}` },
    { 
      key: 'estadoContrato', 
      header: 'Estado', 
      render: (c) => {
        const variant = c.estadoContrato === 'VIGENTE' ? 'success' : c.estadoContrato === 'CANCELADO' ? 'danger' : 'neutral';
        return <Badge variant={variant}>{c.estadoContrato}</Badge>;
      }
    }
  ];

  return (
    <Table
      data={contratos}
      columns={columns}
      getRowKey={(c) => c.idContrato}
      actions={(c) => (
        <div className="table-actions">
          <Button size="sm" variant="ghost" onClick={() => onView(c.idContrato)}>Ver</Button>
          <Button size="sm" variant="ghost" onClick={() => onEdit(c.idContrato)}>Editar</Button>
          <Button size="sm" variant="ghost" onClick={() => onCalcularCosto(c.idContrato)}>Costo</Button>
          <Button size="sm" variant="ghost" onClick={() => onValidarVigencia(c.idContrato)}>Vigencia</Button>
        </div>
      )}
    />
  );
}
