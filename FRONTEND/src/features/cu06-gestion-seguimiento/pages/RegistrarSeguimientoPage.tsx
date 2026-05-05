import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components';
import { useCrearSeguimiento } from '../hooks/useCrearSeguimiento';
import { SeguimientoForm } from '../components/SeguimientoForm';
import type { RegistrarSeguimientoDto, ModificarSeguimientoDto } from '../types/seguimiento.types';
import '../styles/seguimientos.css';

export function RegistrarSeguimientoPage() {
  const navigate = useNavigate();
  const { crearSeguimiento, loading, error } = useCrearSeguimiento();

  const handleSubmit = async (data: RegistrarSeguimientoDto | ModificarSeguimientoDto) => {
    try {
      await crearSeguimiento(data as RegistrarSeguimientoDto);
      navigate('/seguimientos');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="seguimientos-container">
      <header className="seguimientos-header">
        <h1>Registrar Seguimiento</h1>
        <Button variant="ghost" onClick={() => navigate('/seguimientos')}>
          Volver al listado
        </Button>
      </header>

      {error && <div className="feedback-banner error">{error}</div>}

      <div className="form-container" style={{ maxWidth: '900px' }}>
        <SeguimientoForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
