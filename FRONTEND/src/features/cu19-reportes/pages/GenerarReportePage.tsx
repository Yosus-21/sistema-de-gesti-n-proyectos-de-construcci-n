import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components';
import { ReporteForm } from '../components/ReporteForm';
import { useGenerarReporte } from '../hooks/useGenerarReporte';
import '../styles/reportes.css';

export function GenerarReportePage() {
  const navigate = useNavigate();
  const { generarReporte, loading, error } = useGenerarReporte();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      await generarReporte(data);
      navigate('/reportes');
    } catch (err) {
      console.error('Error generating report:', err);
    }
  };

  return (
    <div className="reporte-page">
      <div className="page-header">
        <h1>Generar Nuevo Reporte</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <Card>
        <ReporteForm
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={() => navigate('/reportes')}
        />
      </Card>
    </div>
  );
}
