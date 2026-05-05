import { Card, Button, Loader, Badge } from '../../../shared/components';
import { useValidarVigenciaContrato } from '../hooks/useValidarVigenciaContrato';
import { useEffect } from 'react';

interface ValidarVigenciaContratoDialogProps {
  idContrato: number | null;
  onClose: () => void;
}

export function ValidarVigenciaContratoDialog({ idContrato, onClose }: ValidarVigenciaContratoDialogProps) {
  const { validarVigencia, loading, error, resultado } = useValidarVigenciaContrato();

  useEffect(() => {
    if (idContrato) {
      validarVigencia(idContrato).catch(console.error);
    }
  }, [idContrato, validarVigencia]);

  if (!idContrato) return null;

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title="Validación de Vigencia">
        {loading && <Loader />}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <Button variant="primary" onClick={() => validarVigencia(idContrato)}>Reintentar</Button>
          </div>
        )}

        {resultado && (
          <div className="result-container">
            <div className="result-item big">
              <label>Estado de Vigencia:</label>
              <Badge variant={resultado.esVigente ? 'success' : 'warning'}>
                {resultado.esVigente ? 'VIGENTE' : 'NO VIGENTE'}
              </Badge>
            </div>
            <div className="result-info">
              <p><strong>Mensaje:</strong> {resultado.mensaje}</p>
              <p><strong>Fecha Referencia:</strong> {new Date(resultado.fechaReferencia).toLocaleDateString()}</p>
              <div className="vigencia-dates">
                <div>
                  <label>Inicio:</label>
                  <span>{new Date(resultado.fechaInicio).toLocaleDateString()}</span>
                </div>
                <div>
                  <label>Fin:</label>
                  <span>{new Date(resultado.fechaFin).toLocaleDateString()}</span>
                </div>
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
