import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, Card } from '../../../shared/components';
import { OrdenCompraDetailCard } from '../components/OrdenCompraDetailCard';
import { AgregarLineaOrdenDialog } from '../components/AgregarLineaOrdenDialog';
import { CambiarEstadoOrdenDialog } from '../components/CambiarEstadoOrdenDialog';
import { CalcularMontoTotalOrdenDialog } from '../components/CalcularMontoTotalOrdenDialog';
import { useOrdenCompra } from '../hooks/useOrdenCompra';
import '../styles/ordenes-compra.css';

export function DetalleOrdenCompraPage() {
  const { idOrdenCompra } = useParams<{ idOrdenCompra: string }>();
  const navigate = useNavigate();
  const id = Number(idOrdenCompra);

  const { orden, loading, error, refetch } = useOrdenCompra(id);
  
  const [showAddLine, setShowAddLine] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showTotal, setShowTotal] = useState(false);

  if (loading) return <Loader />;
  if (error || !orden) return <div className="error-card"><p>{error || 'Orden no encontrada'}</p></div>;

  return (
    <div className="detalle-page-container">
      <div className="page-header">
        <h1>Detalle de Orden de Compra</h1>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => navigate('/ordenes-compra')}>Volver</Button>
          <Button variant="primary" onClick={() => navigate(`/ordenes-compra/${id}/editar`)}>Editar</Button>
        </div>
      </div>

      <div className="detalle-content">
        <OrdenCompraDetailCard orden={orden} />

        <Card title="Operaciones Disponibles" className="ops-card">
          <div className="ops-actions">
            <Button onClick={() => setShowAddLine(true)}>Agregar Línea</Button>
            <Button onClick={() => setShowStatus(true)}>Cambiar Estado</Button>
            <Button onClick={() => setShowTotal(true)}>Calcular Monto Total</Button>
          </div>
        </Card>
      </div>

      {showAddLine && (
        <AgregarLineaOrdenDialog
          idOrdenCompra={id}
          onClose={() => setShowAddLine(false)}
          onSuccess={refetch}
        />
      )}

      {showStatus && (
        <CambiarEstadoOrdenDialog
          idOrdenCompra={id}
          estadoActual={orden.estadoOrden}
          onClose={() => setShowStatus(false)}
          onSuccess={refetch}
        />
      )}

      {showTotal && (
        <CalcularMontoTotalOrdenDialog
          idOrdenCompra={id}
          onClose={() => setShowTotal(false)}
        />
      )}
    </div>
  );
}
