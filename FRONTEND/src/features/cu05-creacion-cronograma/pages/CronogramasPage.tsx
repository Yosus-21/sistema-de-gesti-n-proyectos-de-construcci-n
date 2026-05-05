import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState } from '../../../shared/components';
import { useCronogramas } from '../hooks/useCronogramas';
import { useReplanificarCronograma } from '../hooks/useReplanificarCronograma';
import { CronogramasTable } from '../components/CronogramasTable';
import { CronogramaFilters } from '../components/CronogramaFilters';
import { ReplanificarCronogramaDialog } from '../components/ReplanificarCronogramaDialog';
import type { Cronograma, ReplanificarCronogramaDto } from '../types/cronograma.types';
import '../styles/cronogramas.css';

export function CronogramasPage() {
  const navigate = useNavigate();
  const { cronogramas, loading, error, setFiltros, refetch } = useCronogramas();
  const { replanificarCronograma, loading: updating } = useReplanificarCronograma();
  
  const [selectedCronograma, setSelectedCronograma] = useState<Cronograma | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleBuscar = (busqueda: string, idProyecto?: number) => {
    setFiltros({ busqueda, idProyecto });
  };

  const handleLimpiar = () => {
    setFiltros({});
  };

  const handleOpenReplanDialog = (cronograma: Cronograma) => {
    setSelectedCronograma(cronograma);
    setDialogOpen(true);
  };

  const handleConfirmReplan = async (data: ReplanificarCronogramaDto) => {
    if (!selectedCronograma) return;
    try {
      await replanificarCronograma(selectedCronograma.idCronograma, data);
      setDialogOpen(false);
      refetch();
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="cronogramas-container">
      <header className="cronogramas-header">
        <h1>Cronogramas de Proyectos</h1>
        <Button onClick={() => navigate('/cronogramas/nuevo')}>
          Nuevo Cronograma
        </Button>
      </header>

      {error && <div className="feedback-banner error">{error}</div>}

      <CronogramaFilters onBuscar={handleBuscar} onLimpiar={handleLimpiar} />

      {loading && !cronogramas.length ? (
        <Loader text="Cargando cronogramas..." />
      ) : cronogramas.length > 0 ? (
        <CronogramasTable 
          cronogramas={cronogramas} 
          loading={loading} 
          onReplanificar={handleOpenReplanDialog}
        />
      ) : (
        <EmptyState
          title="Sin cronogramas"
          description="No se encontraron cronogramas registrados. Los cronogramas se asocian a proyectos existentes."
          action={
            <Button onClick={() => navigate('/cronogramas/nuevo')}>
              Registrar primer cronograma
            </Button>
          }
        />
      )}

      {selectedCronograma && (
        <ReplanificarCronogramaDialog
          open={dialogOpen}
          cronograma={selectedCronograma}
          onConfirm={handleConfirmReplan}
          onCancel={() => setDialogOpen(false)}
          loading={updating}
        />
      )}
    </div>
  );
}
