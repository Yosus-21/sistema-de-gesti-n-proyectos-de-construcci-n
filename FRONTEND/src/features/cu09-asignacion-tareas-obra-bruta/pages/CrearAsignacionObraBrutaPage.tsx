import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components';
import { useCrearAsignacionObraBruta } from '../hooks/useCrearAsignacionObraBruta';
import { AsignacionObraBrutaForm } from '../components/AsignacionObraBrutaForm';
import type { CrearAsignacionObraBrutaDto, ModificarAsignacionObraBrutaDto } from '../types/asignacion-obra-bruta.types';
import '../styles/asignaciones-obra-bruta.css';

export function CrearAsignacionObraBrutaPage() {
  const navigate = useNavigate();
  const { crearAsignacion, loading, error } = useCrearAsignacionObraBruta();

  const handleSubmit = async (data: CrearAsignacionObraBrutaDto | ModificarAsignacionObraBrutaDto) => {
    try {
      await crearAsignacion(data as CrearAsignacionObraBrutaDto);
      navigate('/asignaciones/obra-bruta');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container small-page">
      <div className="page-header">
        <h1>Nueva Asignación - Obra Bruta</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <Card>
        <AsignacionObraBrutaForm 
          onSubmit={handleSubmit as any} // eslint-disable-line @typescript-eslint/no-explicit-any
          loading={loading}
          onCancel={() => navigate('/asignaciones/obra-bruta')}
        />
      </Card>
    </div>
  );
}
