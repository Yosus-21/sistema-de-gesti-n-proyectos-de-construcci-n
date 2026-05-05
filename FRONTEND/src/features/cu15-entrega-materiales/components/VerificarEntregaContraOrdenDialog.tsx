import { useEffect } from 'react';
import { Card, Button, Loader, Badge } from '../../../shared/components';
import { useVerificarEntregaContraOrden } from '../hooks/useVerificarEntregaContraOrden';

interface VerificarEntregaContraOrdenDialogProps {
  idEntregaMaterial: number;
  idOrdenCompra: number;
  onClose: () => void;
}

export function VerificarEntregaContraOrdenDialog({ idEntregaMaterial, idOrdenCompra, onClose }: VerificarEntregaContraOrdenDialogProps) {
  const { verificar, loading, error, resultado } = useVerificarEntregaContraOrden();

  useEffect(() => {
    verificar(idEntregaMaterial, idOrdenCompra).catch(console.error);
  }, [idEntregaMaterial, idOrdenCompra, verificar]);

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title={`Verificación: Entrega #${idEntregaMaterial}`}>
        {loading && <Loader />}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {resultado && (
          <div className="verification-results">
            <div className={`status-box ${resultado.coincide ? 'match' : 'mismatch'}`}>
              <Badge variant={resultado.coincide ? 'success' : 'danger'}>
                {resultado.coincide ? 'Coincide' : 'No Coincide'}
              </Badge>
              <h3>{resultado.mensaje}</h3>
            </div>

            {!resultado.coincide && (
              <div className="diff-details">
                <p>Existe una diferencia de <strong>{resultado.diferencia}</strong> unidades entre lo solicitado y lo entregado.</p>
              </div>
            )}

            <div className="info-footer">
              <p>ID Orden: {resultado.idOrdenCompra}</p>
              <p>ID Entrega: {resultado.idEntregaMaterial}</p>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <Button variant="primary" onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
}
