import { Card, Button, Loader, Badge } from '../../../shared/components';
import { useValidarProveedor } from '../hooks/useValidarProveedor';
import { useEffect } from 'react';

interface ValidarProveedorDialogProps {
  idProveedor: number;
  nombreProveedor: string;
  onClose: () => void;
}

export function ValidarProveedorDialog({ idProveedor, nombreProveedor, onClose }: ValidarProveedorDialogProps) {
  const { validarProveedor, loading, error, resultado } = useValidarProveedor();

  useEffect(() => {
    if (idProveedor) {
      validarProveedor(idProveedor).catch(console.error);
    }
  }, [idProveedor, validarProveedor]);

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title={`Validar Proveedor: ${nombreProveedor}`}>
        {loading && <Loader />}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {resultado && (
          <div className="check-result">
            <div className={`result-box ${resultado.esValido ? 'success' : 'warning'}`}>
              <Badge variant={resultado.esValido ? 'success' : 'warning'}>
                {resultado.esValido ? 'PROVEEDOR VÁLIDO' : 'REVISIÓN REQUERIDA'}
              </Badge>
              <p className="result-message">{resultado.mensaje}</p>
              <div className="result-info">
                <label>ID Proveedor:</label>
                <span>#{resultado.idProveedor}</span>
              </div>
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
