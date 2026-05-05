import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState } from '../../../shared/components';
import { EntregasMaterialesTable } from '../components/EntregasMaterialesTable';
import { EntregaMaterialFilters } from '../components/EntregaMaterialFilters';
import { ConfirmarRecepcionDialog } from '../components/ConfirmarRecepcionDialog';
import { VerificarEntregaContraOrdenDialog } from '../components/VerificarEntregaContraOrdenDialog';
import { useEntregasMateriales } from '../hooks/useEntregasMateriales';
import type { ListarEntregasMaterialParams } from '../types/entrega-material.types';
import '../styles/entregas-materiales.css';

export function EntregasMaterialesPage() {
  const navigate = useNavigate();
  const { entregas, loading, error, updateParams, refetch } = useEntregasMateriales();

  const [selectedEntregaId, setSelectedEntregaId] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const handleSearch = (params: ListarEntregasMaterialParams) => {
    updateParams(params);
  };

  const handleClear = () => {
    updateParams({});
  };

  return (
    <div className="entregas-materiales-page">
      <div className="page-header">
        <h1>Entregas de Materiales</h1>
        <Button variant="primary" onClick={() => navigate('/entregas-materiales/nueva')}>
          Registrar Entrega
        </Button>
      </div>

      <EntregaMaterialFilters onSearch={handleSearch} onClear={handleClear} />

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="error-card">
          <p>{error}</p>
          <Button onClick={refetch}>Reintentar</Button>
        </div>
      ) : entregas.length === 0 ? (
        <EmptyState
          title="No hay entregas registradas"
          description="Registra la primera entrega de materiales recibida de tus proveedores."
          action={
            <Button variant="primary" onClick={() => navigate('/entregas-materiales/nueva')}>
              Registrar entrega
            </Button>
          }
        />
      ) : (
        <EntregasMaterialesTable
          entregas={entregas}
          onView={(id) => navigate(`/entregas-materiales/${id}`)}
          onConfirm={(id) => {
            setSelectedEntregaId(id);
            setShowConfirm(true);
          }}
          onVerify={(idEntrega, idOrden) => {
            setSelectedEntregaId(idEntrega);
            setSelectedOrderId(idOrden);
            setShowVerify(true);
          }}
        />
      )}

      {showConfirm && selectedEntregaId && (
        <ConfirmarRecepcionDialog
          idEntregaMaterial={selectedEntregaId}
          onClose={() => setShowConfirm(false)}
          onSuccess={refetch}
        />
      )}

      {showVerify && selectedEntregaId && selectedOrderId && (
        <VerificarEntregaContraOrdenDialog
          idEntregaMaterial={selectedEntregaId}
          idOrdenCompra={selectedOrderId}
          onClose={() => setShowVerify(false)}
        />
      )}
    </div>
  );
}
