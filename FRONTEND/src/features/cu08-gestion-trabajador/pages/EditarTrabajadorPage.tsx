import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, Card } from '../../../shared/components';
import { useTrabajador } from '../hooks/useTrabajador';
import { useActualizarTrabajador } from '../hooks/useActualizarTrabajador';
import { TrabajadorForm } from '../components/TrabajadorForm';
import type { RegistrarTrabajadorDto } from '../types/trabajador.types';
import '../styles/trabajadores.css';

export function EditarTrabajadorPage() {
  const { idTrabajador } = useParams<{ idTrabajador: string }>();
  const navigate = useNavigate();
  const id = idTrabajador ? Number(idTrabajador) : null;
  
  const { trabajador, loading: loadingFetch, error: errorFetch } = useTrabajador(id);
  const { actualizarTrabajador, loading: updating, error: errorUpdate } = useActualizarTrabajador();

  const handleSubmit = async (data: RegistrarTrabajadorDto) => {
    if (!id) return;
    try {
      await actualizarTrabajador(id, data);
      navigate(`/trabajadores/${id}`);
    } catch {
      // Error handled by hook
    }
  };

  if (loadingFetch && !trabajador) return <Loader text="Cargando datos del trabajador..." />;
  if (errorFetch) return <div className="feedback-banner error">{errorFetch}</div>;
  if (!trabajador) return <Card>Trabajador no encontrado</Card>;

  return (
    <div className="trabajadores-container">
      <header className="trabajadores-header">
        <h1>Editar Trabajador</h1>
        <Button variant="ghost" onClick={() => navigate(`/trabajadores/${id}`)}>
          Cancelar
        </Button>
      </header>

      {errorUpdate && <div className="feedback-banner error">{errorUpdate}</div>}

      <div className="form-container" style={{ maxWidth: '900px' }}>
        <TrabajadorForm 
          initialData={trabajador} 
          loading={updating} 
          onSubmit={handleSubmit} 
          isEdit 
        />
      </div>
    </div>
  );
}
