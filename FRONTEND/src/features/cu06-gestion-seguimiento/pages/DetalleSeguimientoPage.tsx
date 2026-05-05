import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader } from '../../../shared/components';
import { useSeguimiento } from '../hooks/useSeguimiento';
import { SeguimientoDetailCard } from '../components/SeguimientoDetailCard';
import { CalcularDesviacionDialog } from '../components/CalcularDesviacionDialog';
import '../styles/seguimientos.css';

export function DetalleSeguimientoPage() {
  const { idSeguimiento } = useParams();
  const navigate = useNavigate();
  const { seguimiento, loading, error } = useSeguimiento(Number(idSeguimiento));
  const [showDesviacion, setShowDesviacion] = useState(false);

  if (loading) return <Loader text="Cargando detalle del seguimiento..." />;
  if (error) return <div className="feedback-banner error">{error}</div>;
  if (!seguimiento) return <div className="feedback-banner error">Seguimiento no encontrado</div>;

  return (
    <div className="seguimientos-container">
      <header className="seguimientos-header">
        <h1>Detalle de Seguimiento #{idSeguimiento}</h1>
        <div className="header-actions" style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="ghost" onClick={() => navigate('/seguimientos')}>
            Volver
          </Button>
          <Button variant="secondary" onClick={() => setShowDesviacion(true)}>
            Calcular Desviación
          </Button>
          <Button onClick={() => navigate(`/seguimientos/${idSeguimiento}/editar`)}>
            Editar
          </Button>
        </div>
      </header>

      <div className="detail-container" style={{ maxWidth: '1000px' }}>
        <SeguimientoDetailCard seguimiento={seguimiento} />
      </div>

      <CalcularDesviacionDialog
        idTarea={showDesviacion ? seguimiento.idTarea : null}
        onClose={() => setShowDesviacion(false)}
      />
    </div>
  );
}
