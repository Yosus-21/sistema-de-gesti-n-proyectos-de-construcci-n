import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Loader, EmptyState } from '../../../shared/components';
import { useReportes } from '../hooks/useReportes';
import { ReportesTable } from '../components/ReportesTable';
import { ReporteFilters } from '../components/ReporteFilters';
import { ExportarReportePdfDialog } from '../components/ExportarReportePdfDialog';
import '../styles/reportes.css';

export function ReportesPage() {
  const navigate = useNavigate();
  const { reportes, loading, error, refetch, updateParams } = useReportes();

  const [selectedReporteId, setSelectedReporteId] = useState<number | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleExportPdf = (id: number) => {
    setSelectedReporteId(id);
    setIsExportOpen(true);
  };

  return (
    <div className="reporte-page">
      <div className="page-header">
        <div>
          <h1>Reportes del Sistema</h1>
          <p className="page-subtitle">Generación y consulta de reportes detallados de proyectos, materiales y finanzas.</p>
        </div>
        <div className="header-actions">
          <Button variant="primary" onClick={() => navigate('/reportes/nuevo')}>
            Generar Nuevo Reporte
          </Button>
        </div>
      </div>

      <ReporteFilters 
        onSearch={updateParams}
        onClear={() => updateParams({ idProyecto: undefined, tipoReporte: undefined })}
      />

      {error && <div className="error-banner">{error}</div>}

      <Card>
        {loading ? (
          <Loader />
        ) : reportes.length > 0 ? (
          <ReportesTable
            reportes={reportes}
            onView={(id) => navigate(`/reportes/${id}`)}
            onExportPdf={handleExportPdf}
          />
        ) : (
          <EmptyState
            title="No hay reportes generados"
            description="Comience generando un reporte para analizar el estado de sus proyectos."
          />
        )}
      </Card>

      {selectedReporteId && (
        <ExportarReportePdfDialog
          idReporte={selectedReporteId}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
