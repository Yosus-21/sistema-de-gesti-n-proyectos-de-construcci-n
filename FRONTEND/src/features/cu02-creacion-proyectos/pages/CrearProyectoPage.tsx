import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components';
import { useCrearProyecto } from '../hooks/useCrearProyecto';
import { ProyectoForm } from '../components/ProyectoForm';
import type { CrearProyectoDto } from '../types/proyecto.types';
import '../styles/proyectos.css';

export function CrearProyectoPage() {
  const navigate = useNavigate();
  const { crearProyecto, loading, error } = useCrearProyecto();

  const handleSubmit = async (data: CrearProyectoDto) => {
    try {
      await crearProyecto(data);
      navigate('/proyectos');
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="proyectos-container">
      <header className="proyectos-header">
        <h1>Registrar Nuevo Proyecto</h1>
        <Button variant="ghost" onClick={() => navigate('/proyectos')}>
          Volver al listado
        </Button>
      </header>

      {error && <div className="feedback-banner error">{error}</div>}

      <div className="form-container" style={{ maxWidth: '900px' }}>
        <ProyectoForm loading={loading} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
