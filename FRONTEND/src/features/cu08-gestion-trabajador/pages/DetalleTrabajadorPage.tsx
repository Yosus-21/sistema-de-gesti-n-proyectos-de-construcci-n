import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, Card } from '../../../shared/components';
import { useTrabajador } from '../hooks/useTrabajador';
import { useVerificarDisponibilidadTrabajador } from '../hooks/useVerificarDisponibilidadTrabajador';
import { TrabajadorDetailCard } from '../components/TrabajadorDetailCard';
import { VerificarDisponibilidadDialog } from '../components/VerificarDisponibilidadDialog';
import type { VerificarDisponibilidadTrabajadorParams } from '../types/trabajador.types';
import '../styles/trabajadores.css';

export function DetalleTrabajadorPage() {
  const { idTrabajador } = useParams<{ idTrabajador: string }>();
  const navigate = useNavigate();
  const id = idTrabajador ? Number(idTrabajador) : null;
  
  const { trabajador, loading, error } = useTrabajador(id);
  const { 
    verificarDisponibilidad, 
    resultado, 
    loading: checking, 
    error: checkingError,
    limpiarResultado
  } = useVerificarDisponibilidadTrabajador();

  const [dispDialogOpen, setDispDialogOpen] = useState(false);

  if (loading && !trabajador) return <Loader text="Cargando perfil del trabajador..." />;
  if (error) return <div className="feedback-banner error">{error}</div>;
  if (!trabajador) return <Card>Trabajador no encontrado</Card>;

  const handleVerificarDisp = (params: VerificarDisponibilidadTrabajadorParams) => {
    if (!id) return;
    verificarDisponibilidad(id, params);
  };

  const handleCloseDispDialog = () => {
    setDispDialogOpen(false);
    limpiarResultado();
  };

  return (
    <div className="trabajadores-container">
      <header className="trabajadores-header">
        <div className="header-titles">
          <h1>Perfil del Trabajador</h1>
        </div>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => navigate('/trabajadores')}>
            Volver
          </Button>
          <Button variant="secondary" onClick={() => setDispDialogOpen(true)}>
            Verificar Disponibilidad
          </Button>
          <Button variant="primary" onClick={() => navigate(`/trabajadores/${id}/editar`)}>
            Editar Perfil
          </Button>
        </div>
      </header>

      <TrabajadorDetailCard trabajador={trabajador} />

      {trabajador && (
        <VerificarDisponibilidadDialog
          open={dispDialogOpen}
          trabajador={trabajador}
          onVerificar={handleVerificarDisp}
          onClose={handleCloseDispDialog}
          loading={checking}
          resultado={resultado}
          error={checkingError}
        />
      )}
    </div>
  );
}
