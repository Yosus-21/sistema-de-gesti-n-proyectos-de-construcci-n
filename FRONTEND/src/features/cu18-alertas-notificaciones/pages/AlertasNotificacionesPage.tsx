import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Loader, EmptyState } from '../../../shared/components';
import { useAlertas } from '../hooks/useAlertas';
import { AlertasTable } from '../components/AlertasTable';
import { AlertaFilters } from '../components/AlertaFilters';
import { ActivarAlertaDialog } from '../components/ActivarAlertaDialog';
import { DesactivarAlertaDialog } from '../components/DesactivarAlertaDialog';
import { GenerarNotificacionDialog } from '../components/GenerarNotificacionDialog';
import type { Alerta } from '../types/alerta-notificacion.types';
import '../styles/alertas-notificaciones.css';

export function AlertasNotificacionesPage() {
  const navigate = useNavigate();
  const { alertas, loading, error, refetch, updateParams } = useAlertas();

  const [selectedAlertaId, setSelectedAlertaId] = useState<number | null>(null);
  const [selectedAlerta, setSelectedAlerta] = useState<Alerta | null>(null);
  
  const [isActivarOpen, setIsActivarOpen] = useState(false);
  const [isDesactivarOpen, setIsDesactivarOpen] = useState(false);
  const [isNotificarOpen, setIsNotificarOpen] = useState(false);

  const handleActivar = (id: number) => {
    setSelectedAlertaId(id);
    setIsActivarOpen(true);
  };

  const handleDesactivar = (id: number) => {
    setSelectedAlertaId(id);
    setIsDesactivarOpen(true);
  };

  const handleNotificar = (id: number) => {
    const alert = alertas.find(a => a.idAlerta === id);
    if (alert) {
      setSelectedAlerta(alert);
      setIsNotificarOpen(true);
    }
  };

  return (
    <div className="alerta-page">
      <div className="page-header">
        <div>
          <h1>Alertas y Notificaciones</h1>
          <p className="page-subtitle">Configure y gestione las alertas del sistema para proyectos, tareas y materiales.</p>
        </div>
        <div className="header-actions">
          <Button variant="primary" onClick={() => navigate('/alertas/nueva')}>
            Configurar Nueva Alerta
          </Button>
        </div>
      </div>

      <AlertaFilters 
        onSearch={updateParams}
        onClear={() => updateParams({ idProyecto: undefined, idTarea: undefined, idMaterial: undefined, tipoAlerta: undefined, estadoAlerta: undefined })}
      />

      {error && <div className="error-banner">{error}</div>}

      <Card>
        {loading ? (
          <Loader />
        ) : alertas.length > 0 ? (
          <AlertasTable
            alertas={alertas}
            onView={(id) => navigate(`/alertas/${id}`)}
            onActivar={handleActivar}
            onDesactivar={handleDesactivar}
            onNotificar={handleNotificar}
          />
        ) : (
          <EmptyState
            title="No hay alertas configuradas"
            description="Comience configurando una alerta para recibir notificaciones automáticas."
          />
        )}
      </Card>

      {selectedAlertaId && (
        <>
          <ActivarAlertaDialog
            idAlerta={selectedAlertaId}
            isOpen={isActivarOpen}
            onClose={() => setIsActivarOpen(false)}
            onSuccess={refetch}
          />
          <DesactivarAlertaDialog
            idAlerta={selectedAlertaId}
            isOpen={isDesactivarOpen}
            onClose={() => setIsDesactivarOpen(false)}
            onSuccess={refetch}
          />
        </>
      )}

      {selectedAlerta && (
        <GenerarNotificacionDialog
          idAlerta={selectedAlerta.idAlerta}
          isOpen={isNotificarOpen}
          onClose={() => {
            setIsNotificarOpen(false);
            setSelectedAlerta(null);
          }}
          onSuccess={refetch}
          defaultMessage={selectedAlerta.mensajeNotificacion}
          defaultMethod={selectedAlerta.metodoNotificacion}
          defaultEmail={selectedAlerta.correoDestino}
        />
      )}
    </div>
  );
}
