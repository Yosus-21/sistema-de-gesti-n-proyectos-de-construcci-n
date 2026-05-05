import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, Card } from '../../../shared/components';
import { useCronograma } from '../hooks/useCronograma';
import { useReplanificarCronograma } from '../hooks/useReplanificarCronograma';
import { CronogramaDetailCard } from '../components/CronogramaDetailCard';
import { ReplanificarCronogramaDialog } from '../components/ReplanificarCronogramaDialog';
import type { ReplanificarCronogramaDto } from '../types/cronograma.types';
import '../styles/cronogramas.css';

export function DetalleCronogramaPage() {
  const { idCronograma } = useParams<{ idCronograma: string }>();
  const navigate = useNavigate();
  const id = idCronograma ? Number(idCronograma) : null;
  
  const { cronograma, loading, error, refetch } = useCronograma(id);
  const { replanificarCronograma, loading: updating } = useReplanificarCronograma();
  
  const [dialogOpen, setDialogOpen] = useState(false);

  if (loading && !cronograma) return <Loader text="Cargando detalles del cronograma..." />;
  if (error) return <div className="feedback-banner error">{error}</div>;
  if (!cronograma) return <Card>Cronograma no encontrado</Card>;

  const handleConfirmReplan = async (data: ReplanificarCronogramaDto) => {
    try {
      await replanificarCronograma(cronograma.idCronograma, data);
      setDialogOpen(false);
      refetch();
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="cronogramas-container">
      <header className="cronogramas-header">
        <div className="header-titles">
          <h1>Detalle de Cronograma</h1>
        </div>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => navigate('/cronogramas')}>
            Volver
          </Button>
          <Button variant="secondary" onClick={() => setDialogOpen(true)}>
            Replanificar
          </Button>
        </div>
      </header>

      <CronogramaDetailCard cronograma={cronograma} />

      <ReplanificarCronogramaDialog
        open={dialogOpen}
        cronograma={cronograma}
        onConfirm={handleConfirmReplan}
        onCancel={() => setDialogOpen(false)}
        loading={updating}
      />
    </div>
  );
}
