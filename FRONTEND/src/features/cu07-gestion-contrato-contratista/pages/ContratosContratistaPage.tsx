import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState } from '../../../shared/components';
import { ContratosContratistaTable } from '../components/ContratosContratistaTable';
import { ContratoContratistaFilters } from '../components/ContratoContratistaFilters';
import { CalcularCostoContratoDialog } from '../components/CalcularCostoContratoDialog';
import { ValidarVigenciaContratoDialog } from '../components/ValidarVigenciaContratoDialog';
import { useContratosContratista } from '../hooks/useContratosContratista';
import type { ListarContratosContratistaParams } from '../types/contrato-contratista.types';
import '../styles/contratos-contratista.css';

export function ContratosContratistaPage() {
  const navigate = useNavigate();
  const { contratos, loading, error, updateParams, refetch } = useContratosContratista();
  const [showCostoId, setShowCostoId] = useState<number | null>(null);
  const [showVigenciaId, setShowVigenciaId] = useState<number | null>(null);

  const handleSearch = (params: ListarContratosContratistaParams) => {
    updateParams(params);
  };

  const handleClear = () => {
    updateParams({});
  };

  return (
    <div className="contratos-page-container">
      <div className="page-header">
        <h1>Gestión de Contratos con Contratistas</h1>
        <Button variant="primary" onClick={() => navigate('/contratos/nuevo')}>
          Nuevo Contrato
        </Button>
      </div>

      <ContratoContratistaFilters onSearch={handleSearch} onClear={handleClear} />

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="error-card">
          <p>{error}</p>
          <Button onClick={refetch}>Reintentar</Button>
        </div>
      ) : contratos.length === 0 ? (
        <EmptyState
          title="No hay contratos"
          description="No se encontraron contratos con contratistas para los criterios seleccionados."
          action={
            <Button variant="primary" onClick={() => navigate('/contratos/nuevo')}>
              Registrar primer contrato
            </Button>
          }
        />
      ) : (
        <ContratosContratistaTable
          contratos={contratos}
          onView={(id) => navigate(`/contratos/${id}`)}
          onEdit={(id) => navigate(`/contratos/${id}/editar`)}
          onCalcularCosto={(id) => setShowCostoId(id)}
          onValidarVigencia={(id) => setShowVigenciaId(id)}
        />
      )}

      {showCostoId && (
        <CalcularCostoContratoDialog
          idContrato={showCostoId}
          onClose={() => setShowCostoId(null)}
        />
      )}

      {showVigenciaId && (
        <ValidarVigenciaContratoDialog
          idContrato={showVigenciaId}
          onClose={() => setShowVigenciaId(null)}
        />
      )}
    </div>
  );
}
