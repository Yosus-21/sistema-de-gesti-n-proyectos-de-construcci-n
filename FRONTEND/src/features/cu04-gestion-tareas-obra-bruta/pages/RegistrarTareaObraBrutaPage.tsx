import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components';
import { useCrearTareaObraBruta } from '../hooks/useCrearTareaObraBruta';
import { TareaObraBrutaForm } from '../components/TareaObraBrutaForm';
import type { RegistrarTareaObraBrutaDto, ModificarTareaObraBrutaDto } from '../types/tarea-obra-bruta.types';
import '../styles/tareas-obra-bruta.css';

export function RegistrarTareaObraBrutaPage() {
  const navigate = useNavigate();
  const { crearTarea, loading, error } = useCrearTareaObraBruta();

  const handleSubmit = async (data: RegistrarTareaObraBrutaDto | ModificarTareaObraBrutaDto) => {
    try {
      await crearTarea(data as RegistrarTareaObraBrutaDto);
      navigate('/tareas/obra-bruta');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tareas-container">
      <header className="tareas-header">
        <h1>Registrar Nueva Tarea (Obra Bruta)</h1>
        <Button variant="ghost" onClick={() => navigate('/tareas/obra-bruta')}>
          Volver al listado
        </Button>
      </header>

      {error && <div className="feedback-banner error">{error}</div>}

      <div className="form-container" style={{ maxWidth: '900px' }}>
        <TareaObraBrutaForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
