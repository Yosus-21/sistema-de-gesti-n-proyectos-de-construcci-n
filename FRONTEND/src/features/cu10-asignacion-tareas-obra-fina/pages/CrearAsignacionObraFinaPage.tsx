import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components';
import { useCrearAsignacionObraFina } from '../hooks/useCrearAsignacionObraFina';
import { AsignacionObraFinaForm } from '../components/AsignacionObraFinaForm';
import type { CrearAsignacionObraFinaDto } from '../types/asignacion-obra-fina.types';
import '../styles/asignaciones-obra-fina.css';

export function CrearAsignacionObraFinaPage() {
  const navigate = useNavigate();
  const { crearAsignacion, loading, error } = useCrearAsignacionObraFina();

  const handleSubmit = async (data: CrearAsignacionObraFinaDto) => {
    try {
      await crearAsignacion(data);
      navigate('/asignaciones/obra-fina');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container small-page">
      <div className="page-header">
        <h1>Nueva Asignación de Obra Fina</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <Card>
        <AsignacionObraFinaForm 
          onSubmit={handleSubmit as any} // eslint-disable-line @typescript-eslint/no-explicit-any
          loading={loading}
          onCancel={() => navigate('/asignaciones/obra-fina')}
        />
      </Card>
    </div>
  );
}
