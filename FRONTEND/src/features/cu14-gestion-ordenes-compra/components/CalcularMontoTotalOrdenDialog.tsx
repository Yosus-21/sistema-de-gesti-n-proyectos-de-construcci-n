import { Card, Button, Loader } from '../../../shared/components';
import { useCalcularMontoTotalOrdenCompra } from '../hooks/useCalcularMontoTotalOrdenCompra';
import { useEffect } from 'react';

interface CalcularMontoTotalOrdenDialogProps {
  idOrdenCompra: number;
  onClose: () => void;
}

export function CalcularMontoTotalOrdenDialog({ idOrdenCompra, onClose }: CalcularMontoTotalOrdenDialogProps) {
  const { calcularMonto, loading, error, resultado } = useCalcularMontoTotalOrdenCompra();

  useEffect(() => {
    if (idOrdenCompra) {
      calcularMonto(idOrdenCompra).catch(console.error);
    }
  }, [idOrdenCompra, calcularMonto]);

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title={`Monto Total: Orden #${idOrdenCompra}`}>
        {loading && <Loader />}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {resultado && (
          <div className="result-container">
            <div className="monto-box">
              <label>Monto Calculado:</label>
              <span className="amount">{resultado.moneda} {resultado.montoTotal.toLocaleString()}</span>
            </div>
            <p className="helper-text">
              Este monto se calcula sumando el (precio unitario acordado * cantidad solicitada) de todas las líneas de la orden.
            </p>
          </div>
        )}

        <div className="modal-actions">
          <Button variant="primary" onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
}
