import { Card, Button, Loader, Badge } from '../../../shared/components';
import { useCalcularCostoContrato } from '../hooks/useCalcularCostoContrato';
import { useEffect } from 'react';

interface CalcularCostoContratoDialogProps {
  idContrato: number | null;
  onClose: () => void;
}

export function CalcularCostoContratoDialog({ idContrato, onClose }: CalcularCostoContratoDialogProps) {
  const { calcularCosto, loading, error, resultado } = useCalcularCostoContrato();

  useEffect(() => {
    if (idContrato) {
      calcularCosto(idContrato).catch(console.error);
    }
  }, [idContrato, calcularCosto]);

  if (!idContrato) return null;

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title="Cálculo de Costo de Contrato">
        {loading && <Loader />}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <Button variant="primary" onClick={() => calcularCosto(idContrato)}>Reintentar</Button>
          </div>
        )}

        {resultado && (
          <div className="result-container">
            <div className="result-item">
              <label>ID Contrato:</label>
              <span>#{resultado.idContrato}</span>
            </div>
            <div className="result-item">
              <label>Costo Total Calculado:</label>
              <span className="price-text">${resultado.costoTotal.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <label>Método de Cálculo:</label>
              <Badge variant="info">{resultado.metodoCalculo}</Badge>
            </div>
            <p className="helper-text">El costo total se calcula sumando todos los subtotales de los detalles del contrato.</p>
          </div>
        )}

        <div className="modal-actions">
          <Button variant="primary" onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
}
