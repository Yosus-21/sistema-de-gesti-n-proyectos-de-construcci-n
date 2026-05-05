import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components';
import { useCrearAsignacionContratista } from '../hooks/useCrearAsignacionContratista';
import { AsignacionContratistaForm } from '../components/AsignacionContratistaForm';
import type { CrearAsignacionContratistaDto } from '../types/asignacion-contratista.types';
import '../styles/asignaciones-contratista.css';

export function CrearAsignacionContratistaPage() {
  const navigate = useNavigate();
  const { crearAsignacion, loading, error } = useCrearAsignacionContratista();

  const handleSubmit = async (data: CrearAsignacionContratistaDto) => {
    try {
      await crearAsignacion(data);
      navigate('/asignaciones/contratista');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container small-page">
      <div className="page-header">
        <h1>Nueva Asignación por Contratista</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <Card>
        <AsignacionContratistaForm 
          onSubmit={handleSubmit as any} // eslint-disable-line @typescript-eslint/no-explicit-any
          loading={loading}
          onCancel={() => navigate('/asignaciones/contratista')}
        />
      </Card>
    </div>
  );
}
