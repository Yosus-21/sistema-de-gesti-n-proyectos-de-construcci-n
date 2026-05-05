import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components';
import { useCrearTrabajador } from '../hooks/useCrearTrabajador';
import { TrabajadorForm } from '../components/TrabajadorForm';
import type { RegistrarTrabajadorDto } from '../types/trabajador.types';
import '../styles/trabajadores.css';

export function RegistrarTrabajadorPage() {
  const navigate = useNavigate();
  const { crearTrabajador, loading, error } = useCrearTrabajador();

  const handleSubmit = async (data: RegistrarTrabajadorDto) => {
    try {
      await crearTrabajador(data);
      navigate('/trabajadores');
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="trabajadores-container">
      <header className="trabajadores-header">
        <h1>Registrar Nuevo Trabajador</h1>
        <Button variant="ghost" onClick={() => navigate('/trabajadores')}>
          Volver al listado
        </Button>
      </header>

      {error && <div className="feedback-banner error">{error}</div>}

      <div className="form-container" style={{ maxWidth: '900px' }}>
        <TrabajadorForm loading={loading} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
