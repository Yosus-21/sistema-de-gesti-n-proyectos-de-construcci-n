import { Table, Button, Badge } from '../../../shared/components';
import type { Reporte } from '../types/reporte.types';

interface ReportesTableProps {
  reportes: Reporte[];
  onView: (id: number) => void;
  onExportPdf: (id: number) => void;
}

export function ReportesTable({ reportes, onView, onExportPdf }: ReportesTableProps) {
  return (
    <Table
      data={reportes}
      columns={[
        { header: 'ID', key: 'idReporte' },
        { header: 'Tipo', key: 'tipoReporte' },
        { 
          header: 'Proyecto', 
          key: 'idProyecto',
          render: (item) => item.proyecto?.nombre || (item.idProyecto ? `Proyecto #${item.idProyecto}` : 'General')
        },
        { 
          header: 'Fecha Gen.', 
          key: 'fechaGeneracion',
          render: (item) => item.fechaGeneracion ? new Date(item.fechaGeneracion).toLocaleDateString() : '-'
        },
        { 
          header: 'Avance', 
          key: 'porcentajeAvanceGeneral',
          render: (item) => item.porcentajeAvanceGeneral !== undefined ? `${item.porcentajeAvanceGeneral}%` : '-'
        },
        { 
          header: 'Archivo PDF', 
          key: 'rutaArchivoPdf',
          render: (item) => item.rutaArchivoPdf ? (
            <Badge variant="success">GENERADO</Badge>
          ) : (
            <Badge variant="neutral">PENDIENTE</Badge>
          )
        },
      ]}
      getRowKey={(item) => item.idReporte}
      actions={(item) => (
        <div className="table-actions">
          <Button size="sm" variant="ghost" onClick={() => onView(item.idReporte)}>Ver</Button>
          <Button size="sm" variant="primary" onClick={() => onExportPdf(item.idReporte)}>Exportar PDF</Button>
        </div>
      )}
    />
  );
}
