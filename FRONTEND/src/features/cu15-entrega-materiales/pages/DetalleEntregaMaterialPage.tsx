import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, Card } from '../../../shared/components';
import { EntregaMaterialDetailCard } from '../components/EntregaMaterialDetailCard';
import { ConfirmarRecepcionDialog } from '../components/ConfirmarRecepcionDialog';
import { VerificarEntregaContraOrdenDialog } from '../components/VerificarEntregaContraOrdenDialog';
import { useEntregaMaterial } from '../hooks/useEntregaMaterial';
import '../styles/entregas-materiales.css';

export function DetalleEntregaMaterialPage() {
  const { idEntregaMaterial } = useParams<{ idEntregaMaterial: string }>();
  const navigate = useNavigate();
  const id = Number(idEntregaMaterial);

  const { entrega, loading, error, refetch } = useEntregaMaterial(id);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  if (loading) return <Loader />;
  if (error || !entrega) return <div className="error-card"><p>{error || 'Entrega no encontrada'}</p></div>;

  return (
    <div className="detalle-page-container">
      <div className="page-header">
        <h1>Detalle de Entrega de Material</h1>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => navigate('/entregas-materiales')}>Volver</Button>
        </div>
      </div>

      <div className="detalle-content">
        <EntregaMaterialDetailCard entrega={entrega} />

        <Card title="Operaciones Disponibles" className="ops-card">
          <div className="ops-actions">
            <Button 
              onClick={() => setShowConfirm(true)} 
              disabled={entrega.estadoEntrega === 'RECIBIDA'}
              variant={entrega.estadoEntrega === 'RECIBIDA' ? 'ghost' : 'primary'}
            >
              Confirmar Recepción
            </Button>
            <Button onClick={() => setShowVerify(true)}>Verificar Contra Orden</Button>
          </div>
        </Card>
      </div>

      {showConfirm && (
        <ConfirmarRecepcionDialog
          idEntregaMaterial={id}
          onClose={() => setShowConfirm(false)}
          onSuccess={refetch}
        />
      )}

      {showVerify && (
        <VerificarEntregaContraOrdenDialog
          idEntregaMaterial={id}
          idOrdenCompra={entrega.idOrdenCompra}
          onClose={() => setShowVerify(false)}
        />
      )}
    </div>
  );
}
