import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components';
import { AlertaForm } from '../components/AlertaForm';
import { useConfigurarAlerta } from '../hooks/useConfigurarAlerta';
import '../styles/alertas-notificaciones.css';

export function ConfigurarAlertaPage() {
  const navigate = useNavigate();
  const { configurarAlerta, loading, error } = useConfigurarAlerta();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    try {
      await configurarAlerta(data);
      navigate('/alertas');
    } catch (err) {
      console.error('Error configuring alert:', err);
    }
  };

  return (
    <div className="alerta-page">
      <div className="page-header">
        <h1>Configurar Nueva Alerta</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <Card>
        <AlertaForm
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={() => navigate('/alertas')}
        />
      </Card>
    </div>
  );
}
