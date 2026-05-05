import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components';
import { useCrearTareaObraFina } from '../hooks/useCrearTareaObraFina';
import { TareaObraFinaForm } from '../components/TareaObraFinaForm';
import type { RegistrarTareaObraFinaDto, ModificarTareaObraFinaDto } from '../types/tarea-obra-fina.types';
import '../styles/tareas-obra-fina.css';

export function RegistrarTareaObraFinaPage() {
  const navigate = useNavigate();
  const { crearTarea, loading, error } = useCrearTareaObraFina();

  const handleSubmit = async (data: RegistrarTareaObraFinaDto | ModificarTareaObraFinaDto) => {
    try {
      await crearTarea(data as RegistrarTareaObraFinaDto);
      navigate('/tareas/obra-fina');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="tareas-container">
      <header className="tareas-header">
        <h1>Registrar Nueva Tarea (Obra Fina)</h1>
        <Button variant="ghost" onClick={() => navigate('/tareas/obra-fina')}>
          Volver al listado
        </Button>
      </header>

      {error && <div className="feedback-banner error">{error}</div>}

      <div className="form-container" style={{ maxWidth: '900px' }}>
        <TareaObraFinaForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
