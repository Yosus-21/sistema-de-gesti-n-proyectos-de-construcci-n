import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader } from '../../../shared/components';
import { useReporte } from '../hooks/useReporte';
import { ReporteDetailCard } from '../components/ReporteDetailCard';
import { ExportarReportePdfDialog } from '../components/ExportarReportePdfDialog';
import '../styles/reportes.css';

export function DetalleReportePage() {
  const { idReporte } = useParams();
  const navigate = useNavigate();
  const id = Number(idReporte);

  const { reporte, loading, error, refetch } = useReporte(id);
  const [isExportOpen, setIsExportOpen] = useState(false);

  if (loading) return <Loader />;
  if (error) return <div className="reporte-page"><div className="error-banner">{error}</div></div>;
  if (!reporte) return null;

  return (
    <div className="reporte-page">
      <div className="page-header">
        <h1>Detalle de Reporte #{reporte.idReporte}</h1>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => navigate('/reportes')}>Volver</Button>
          <Button variant="primary" onClick={() => setIsExportOpen(true)}>Exportar PDF</Button>
        </div>
      </div>

      <ReporteDetailCard reporte={reporte} />

      <ExportarReportePdfDialog
        idReporte={id}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
