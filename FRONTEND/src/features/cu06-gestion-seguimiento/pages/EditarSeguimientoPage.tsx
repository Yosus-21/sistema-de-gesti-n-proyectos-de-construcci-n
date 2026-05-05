import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader } from '../../../shared/components';
import { useSeguimiento } from '../hooks/useSeguimiento';
import { useActualizarSeguimiento } from '../hooks/useActualizarSeguimiento';
import { SeguimientoForm } from '../components/SeguimientoForm';
import type { RegistrarSeguimientoDto, ModificarSeguimientoDto } from '../types/seguimiento.types';
import '../styles/seguimientos.css';

export function EditarSeguimientoPage() {
  const { idSeguimiento } = useParams();
  const navigate = useNavigate();
  const { seguimiento, loading: loadingData, error: errorData } = useSeguimiento(Number(idSeguimiento));
  const { actualizarSeguimiento, loading: updating, error: errorUpdate } = useActualizarSeguimiento();

  const handleSubmit = async (data: RegistrarSeguimientoDto | ModificarSeguimientoDto) => {
    if (!idSeguimiento) return;
    try {
      await actualizarSeguimiento(Number(idSeguimiento), data as ModificarSeguimientoDto);
      navigate(`/seguimientos/${idSeguimiento}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (loadingData) return <Loader text="Cargando datos del seguimiento..." />;
  if (errorData) return <div className="feedback-banner error">{errorData}</div>;
  if (!seguimiento) return <div className="feedback-banner error">Seguimiento no encontrado</div>;

  return (
    <div className="seguimientos-container">
      <header className="seguimientos-header">
        <h1>Editar Seguimiento #{idSeguimiento}</h1>
        <Button variant="ghost" onClick={() => navigate(`/seguimientos/${idSeguimiento}`)}>
          Cancelar
        </Button>
      </header>

      {errorUpdate && <div className="feedback-banner error">{errorUpdate}</div>}

      <div className="form-container" style={{ maxWidth: '900px' }}>
        <SeguimientoForm 
          initialData={seguimiento} 
          onSubmit={handleSubmit} 
          loading={updating} 
          isEdit 
        />
      </div>
    </div>
  );
}
