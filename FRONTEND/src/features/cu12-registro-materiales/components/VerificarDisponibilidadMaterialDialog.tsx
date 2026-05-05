import { useState } from 'react';
import { Card, Input, Button, Loader, Badge } from '../../../shared/components';
import { useVerificarDisponibilidadMaterial } from '../hooks/useVerificarDisponibilidadMaterial';

interface VerificarDisponibilidadMaterialDialogProps {
  idMaterial: number;
  nombreMaterial: string;
  onClose: () => void;
}

export function VerificarDisponibilidadMaterialDialog({ idMaterial, nombreMaterial, onClose }: VerificarDisponibilidadMaterialDialogProps) {
  const { verificarDisponibilidad, loading, error, resultado } = useVerificarDisponibilidadMaterial();
  const [cantidad, setCantidad] = useState(1);

  const handleCheck = async () => {
    try {
      await verificarDisponibilidad(idMaterial, cantidad);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title={`Verificar Disponibilidad: ${nombreMaterial}`}>
        <div className="check-form">
          <Input
            label="Cantidad Requerida"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            min={1}
          />
          <Button variant="primary" onClick={handleCheck} loading={loading}>
            Verificar
          </Button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {loading && <Loader />}

        {resultado && (
          <div className="check-result">
            <div className={`result-box ${resultado.esDisponible ? 'success' : 'danger'}`}>
              <Badge variant={resultado.esDisponible ? 'success' : 'danger'}>
                {resultado.esDisponible ? 'DISPONIBLE' : 'INSUFICIENTE'}
              </Badge>
              <p>{resultado.mensaje}</p>
              <div className="result-stats">
                <div>
                  <label>Disponible en almacén:</label>
                  <span>{resultado.cantidadDisponible}</span>
                </div>
                <div>
                  <label>Requerido:</label>
                  <span>{resultado.cantidadRequerida}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
}
