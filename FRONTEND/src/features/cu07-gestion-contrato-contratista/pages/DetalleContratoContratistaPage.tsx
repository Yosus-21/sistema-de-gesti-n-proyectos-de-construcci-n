import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, Card } from '../../../shared/components';
import { ContratoContratistaDetailCard } from '../components/ContratoContratistaDetailCard';
import { CalcularCostoContratoDialog } from '../components/CalcularCostoContratoDialog';
import { ValidarVigenciaContratoDialog } from '../components/ValidarVigenciaContratoDialog';
import { useContratoContratista } from '../hooks/useContratoContratista';
import '../styles/contratos-contratista.css';

export function DetalleContratoContratistaPage() {
  const { idContrato } = useParams<{ idContrato: string }>();
  const navigate = useNavigate();
  const id = Number(idContrato);

  const { contrato, loading, error } = useContratoContratista(id);
  const [showCosto, setShowCosto] = useState(false);
  const [showVigencia, setShowVigencia] = useState(false);

  if (loading) return <Loader />;
  if (error || !contrato) return <div className="error-card"><p>{error || 'Contrato no encontrado'}</p></div>;

  return (
    <div className="detalle-page-container">
      <div className="page-header">
        <h1>Detalle de Contrato</h1>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => navigate('/contratos')}>Volver</Button>
          <Button variant="primary" onClick={() => navigate(`/contratos/${id}/editar`)}>Editar</Button>
        </div>
      </div>

      <div className="detalle-content">
        <ContratoContratistaDetailCard contrato={contrato} />

        <Card title="Acciones Rápidas" className="quick-actions-card">
          <div className="quick-actions">
            <Button onClick={() => setShowCosto(true)}>Calcular Costo Real</Button>
            <Button onClick={() => setShowVigencia(true)}>Validar Vigencia</Button>
          </div>
        </Card>
      </div>

      {showCosto && (
        <CalcularCostoContratoDialog
          idContrato={id}
          onClose={() => setShowCosto(false)}
        />
      )}

      {showVigencia && (
        <ValidarVigenciaContratoDialog
          idContrato={id}
          onClose={() => setShowVigencia(false)}
        />
      )}
    </div>
  );
}
