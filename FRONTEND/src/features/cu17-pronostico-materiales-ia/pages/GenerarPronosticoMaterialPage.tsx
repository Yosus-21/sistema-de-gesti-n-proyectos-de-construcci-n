import { useNavigate } from 'react-router-dom';
import { useGenerarPronosticoMaterial } from '../hooks/useGenerarPronosticoMaterial';
import { GenerarPronosticoMaterialForm } from '../components/GenerarPronosticoMaterialForm';
import { Card } from '../../../shared/components';
import type { GenerarPronosticoMaterialDto } from '../types/pronostico-material-ia.types';
import '../styles/pronostico-materiales-ia.css';

export function GenerarPronosticoMaterialPage() {
  const navigate = useNavigate();
  const { generarPronostico, loading, error } = useGenerarPronosticoMaterial();

  const handleSubmit = async (data: GenerarPronosticoMaterialDto) => {
    try {
      await generarPronostico(data);
      navigate('/ia/pronostico-materiales');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ia-page">
      <div className="page-header">
        <h1>Generar Pronóstico de Materiales IA</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <Card>
        <GenerarPronosticoMaterialForm
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={() => navigate('/ia/pronostico-materiales')}
        />
      </Card>
    </div>
  );
}
