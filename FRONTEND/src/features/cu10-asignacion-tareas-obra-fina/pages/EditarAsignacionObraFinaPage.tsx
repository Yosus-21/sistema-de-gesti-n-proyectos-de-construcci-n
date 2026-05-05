import { useParams, useNavigate } from 'react-router-dom';
import { Card, Loader, EmptyState } from '../../../shared/components';
import { useAsignacionObraFina } from '../hooks/useAsignacionObraFina';
import { useModificarAsignacionObraFina } from '../hooks/useModificarAsignacionObraFina';
import { AsignacionObraFinaForm } from '../components/AsignacionObraFinaForm';
import type { ModificarAsignacionObraFinaDto } from '../types/asignacion-obra-fina.types';
import '../styles/asignaciones-obra-fina.css';

export function EditarAsignacionObraFinaPage() {
  const { idAsignacionTarea } = useParams();
  const navigate = useNavigate();
  
  const { asignacion, loading: loadingData, error: errorData } = useAsignacionObraFina(Number(idAsignacionTarea));
  const { modificarAsignacion, loading: updating, error: errorUpdate } = useModificarAsignacionObraFina();

  const handleSubmit = async (data: ModificarAsignacionObraFinaDto) => {
    if (!idAsignacionTarea) return;
    try {
      await modificarAsignacion(Number(idAsignacionTarea), data);
      navigate(`/asignaciones/obra-fina/${idAsignacionTarea}`);
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
        <h1>Editar Asignación de Obra Fina</h1>
      </div>

      {errorUpdate && <div className="error-banner">{errorUpdate}</div>}

      <Card>
        <AsignacionObraFinaForm 
          initialData={asignacion}
          onSubmit={handleSubmit as any} // eslint-disable-line @typescript-eslint/no-explicit-any
          loading={updating}
          onCancel={() => navigate(`/asignaciones/obra-fina/${idAsignacionTarea}`)}
        />
      </Card>
    </div>
  );
}
