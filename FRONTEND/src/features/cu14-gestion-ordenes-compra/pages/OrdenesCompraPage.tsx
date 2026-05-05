import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState } from '../../../shared/components';
import { OrdenesCompraTable } from '../components/OrdenesCompraTable';
import { OrdenCompraFilters } from '../components/OrdenCompraFilters';
import { AgregarLineaOrdenDialog } from '../components/AgregarLineaOrdenDialog';
import { CambiarEstadoOrdenDialog } from '../components/CambiarEstadoOrdenDialog';
import { CalcularMontoTotalOrdenDialog } from '../components/CalcularMontoTotalOrdenDialog';
import { useOrdenesCompra } from '../hooks/useOrdenesCompra';
import type { ListarOrdenesCompraParams, EstadoOrden } from '../types/orden-compra.types';
import '../styles/ordenes-compra.css';

export function OrdenesCompraPage() {
  const navigate = useNavigate();
  const { ordenes, loading, error, updateParams, refetch } = useOrdenesCompra();

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrderState, setSelectedOrderState] = useState<EstadoOrden | undefined>(undefined);
  
  const [showAddLine, setShowAddLine] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showTotal, setShowTotal] = useState(false);

  const handleSearch = (params: ListarOrdenesCompraParams) => {
    updateParams(params);
  };

  const handleClear = () => {
    updateParams({});
  };

  return (
    <div className="ordenes-compra-page">
      <div className="page-header">
        <h1>Gestión de Órdenes de Compra</h1>
        <Button variant="primary" onClick={() => navigate('/ordenes-compra/nueva')}>
          Nueva Orden
        </Button>
      </div>

      <OrdenCompraFilters onSearch={handleSearch} onClear={handleClear} />

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="error-card">
          <p>{error}</p>
          <Button onClick={refetch}>Reintentar</Button>
        </div>
      ) : ordenes.length === 0 ? (
        <EmptyState
          title="No hay órdenes de compra"
          description="Comienza creando una nueva orden de compra para tus proveedores."
          action={
            <Button variant="primary" onClick={() => navigate('/ordenes-compra/nueva')}>
              Crear primera orden
            </Button>
          }
        />
      ) : (
        <OrdenesCompraTable
          ordenes={ordenes}
          onView={(id) => navigate(`/ordenes-compra/${id}`)}
          onEdit={(id) => navigate(`/ordenes-compra/${id}/editar`)}
          onAddLine={(id) => {
            setSelectedOrderId(id);
            setShowAddLine(true);
          }}
          onChangeStatus={(id) => {
            const o = ordenes.find(x => x.idOrdenCompra === id);
            setSelectedOrderId(id);
            setSelectedOrderState(o?.estadoOrden);
            setShowStatus(true);
          }}
          onCalculateTotal={(id) => {
            setSelectedOrderId(id);
            setShowTotal(true);
          }}
        />
      )}

      {showAddLine && selectedOrderId && (
        <AgregarLineaOrdenDialog
          idOrdenCompra={selectedOrderId}
          onClose={() => setShowAddLine(false)}
          onSuccess={refetch}
        />
      )}

      {showStatus && selectedOrderId && (
        <CambiarEstadoOrdenDialog
          idOrdenCompra={selectedOrderId}
          estadoActual={selectedOrderState}
          onClose={() => setShowStatus(false)}
          onSuccess={refetch}
        />
      )}

      {showTotal && selectedOrderId && (
        <CalcularMontoTotalOrdenDialog
          idOrdenCompra={selectedOrderId}
          onClose={() => setShowTotal(false)}
        />
      )}
    </div>
  );
}
