import { useParams, useNavigate } from 'react-router-dom';
import { Card, Loader, EmptyState } from '../../../shared/components';
import { useAsignacionObraBruta } from '../hooks/useAsignacionObraBruta';
import { useActualizarAsignacionObraBruta } from '../hooks/useActualizarAsignacionObraBruta';
import { AsignacionObraBrutaForm } from '../components/AsignacionObraBrutaForm';
import type { CrearAsignacionObraBrutaDto, ModificarAsignacionObraBrutaDto } from '../types/asignacion-obra-bruta.types';
import '../styles/asignaciones-obra-bruta.css';

export function EditarAsignacionObraBrutaPage() {
  const { idAsignacionTarea } = useParams();
  const navigate = useNavigate();
  const { asignacion, loading: loadingData, error: errorData } = useAsignacionObraBruta(Number(idAsignacionTarea));
  const { actualizarAsignacion, loading: updating, error: errorUpdate } = useActualizarAsignacionObraBruta();

  const handleSubmit = async (data: CrearAsignacionObraBrutaDto | ModificarAsignacionObraBrutaDto) => {
    if (!idAsignacionTarea) return;
    try {
      await actualizarAsignacion(Number(idAsignacionTarea), data as ModificarAsignacionObraBrutaDto);
      navigate(`/asignaciones/obra-bruta/${idAsignacionTarea}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingData) return <Loader />;
  if (errorData) return <div className="error-banner">{errorData}</div>;
  if (!asignacion) return <EmptyState title="No encontrado" description="La asignación no existe." />;

  return (
    <div className="page-container small-page">
      <div className="page-header">
        <h1>Editar Asignación - Obra Bruta</h1>
      </div>

      {errorUpdate && <div className="error-banner">{errorUpdate}</div>}

      <Card>
        <AsignacionObraBrutaForm 
          initialData={asignacion}
          onSubmit={handleSubmit as any} // eslint-disable-line @typescript-eslint/no-explicit-any
          loading={updating}
          onCancel={() => navigate(`/asignaciones/obra-bruta/${idAsignacionTarea}`)}
        />
      </Card>
    </div>
  );
}
