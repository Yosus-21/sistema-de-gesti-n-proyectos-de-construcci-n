import { useNavigate } from 'react-router-dom';
import { useGenerarPropuestaAsignacionMaterial } from '../hooks/useGenerarPropuestaAsignacionMaterial';
import { GenerarPropuestaAsignacionMaterialForm } from '../components/GenerarPropuestaAsignacionMaterialForm';
import { Card } from '../../../shared/components';
import type { GenerarPropuestaAsignacionMaterialDto } from '../types/asignacion-material-ia.types';
import '../styles/asignacion-materiales-ia.css';

export function GenerarPropuestaAsignacionMaterialPage() {
  const navigate = useNavigate();
  const { generarPropuesta, loading, error } = useGenerarPropuestaAsignacionMaterial();

  const handleSubmit = async (data: GenerarPropuestaAsignacionMaterialDto) => {
    try {
      await generarPropuesta(data);
      // Redirigir al listado tras éxito
      navigate('/ia/asignacion-materiales');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ia-page">
      <div className="page-header">
        <h1>Generar Propuesta de Asignación IA</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <Card>
        <GenerarPropuestaAsignacionMaterialForm
          onSubmit={handleSubmit}
          loading={loading}
          onCancel={() => navigate('/ia/asignacion-materiales')}
        />
      </Card>
    </div>
  );
}
