import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components';
import { useCrearCronograma } from '../hooks/useCrearCronograma';
import { CronogramaForm } from '../components/CronogramaForm';
import type { CrearCronogramaDto } from '../types/cronograma.types';
import '../styles/cronogramas.css';

export function CrearCronogramaPage() {
  const navigate = useNavigate();
  const { crearCronograma, loading, error } = useCrearCronograma();

  const handleSubmit = async (data: CrearCronogramaDto) => {
    try {
      await crearCronograma(data);
      navigate('/cronogramas');
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="cronogramas-container">
      <header className="cronogramas-header">
        <h1>Registrar Nuevo Cronograma</h1>
        <Button variant="ghost" onClick={() => navigate('/cronogramas')}>
          Volver al listado
        </Button>
      </header>

      {error && <div className="feedback-banner error">{error}</div>}

      <div className="form-container" style={{ maxWidth: '800px' }}>
        <CronogramaForm loading={loading} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
