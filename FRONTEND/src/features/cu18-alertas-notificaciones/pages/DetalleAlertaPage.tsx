import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader } from '../../../shared/components';
import { useAlerta } from '../hooks/useAlerta';
import { AlertaDetailCard } from '../components/AlertaDetailCard';
import { ActivarAlertaDialog } from '../components/ActivarAlertaDialog';
import { DesactivarAlertaDialog } from '../components/DesactivarAlertaDialog';
import { GenerarNotificacionDialog } from '../components/GenerarNotificacionDialog';
import '../styles/alertas-notificaciones.css';

export function DetalleAlertaPage() {
  const { idAlerta } = useParams();
  const navigate = useNavigate();
  const id = Number(idAlerta);

  const { alerta, loading, error, refetch } = useAlerta(id);
  
  const [isActivarOpen, setIsActivarOpen] = useState(false);
  const [isDesactivarOpen, setIsDesactivarOpen] = useState(false);
  const [isNotificarOpen, setIsNotificarOpen] = useState(false);

  if (loading) return <Loader />;
  if (error) return <div className="alerta-page"><div className="error-banner">{error}</div></div>;
  if (!alerta) return null;

  return (
    <div className="alerta-page">
      <div className="page-header">
        <h1>Detalle de Alerta #{alerta.idAlerta}</h1>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => navigate('/alertas')}>Volver</Button>
          {alerta.estadoAlerta === 'INACTIVA' && (
            <Button variant="primary" onClick={() => setIsActivarOpen(true)}>Activar</Button>
          )}
          {alerta.estadoAlerta === 'ACTIVA' && (
            <Button variant="danger" onClick={() => setIsDesactivarOpen(true)}>Desactivar</Button>
          )}
          <Button variant="primary" onClick={() => setIsNotificarOpen(true)}>Generar Notificación</Button>
        </div>
      </div>

      <AlertaDetailCard alerta={alerta} />

      <ActivarAlertaDialog
        idAlerta={id}
        isOpen={isActivarOpen}
        onClose={() => setIsActivarOpen(false)}
        onSuccess={refetch}
      />
      <DesactivarAlertaDialog
        idAlerta={id}
        isOpen={isDesactivarOpen}
        onClose={() => setIsDesactivarOpen(false)}
        onSuccess={refetch}
      />
      <GenerarNotificacionDialog
        idAlerta={id}
        isOpen={isNotificarOpen}
        onClose={() => setIsNotificarOpen(false)}
        onSuccess={refetch}
        defaultMessage={alerta.mensajeNotificacion}
        defaultMethod={alerta.metodoNotificacion}
        defaultEmail={alerta.correoDestino}
      />
    </div>
  );
}
