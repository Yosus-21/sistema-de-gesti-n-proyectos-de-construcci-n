import { Card, Button } from '../../../shared/components';
import { useConfirmarPronosticoMaterial } from '../hooks/useConfirmarPronosticoMaterial';

interface ConfirmarPronosticoMaterialDialogProps {
  idPronosticoMaterial: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConfirmarPronosticoMaterialDialog({ idPronosticoMaterial, onClose, onSuccess }: ConfirmarPronosticoMaterialDialogProps) {
  const { confirmarPronostico, loading, error } = useConfirmarPronosticoMaterial();

  const handleConfirm = async () => {
    try {
      await confirmarPronostico(idPronosticoMaterial);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title="Confirmar Pronóstico IA">
        <div className="warning-banner">
          <p><strong>Atención:</strong> Confirmar pronóstico no crea órdenes de compra automáticamente; solo consolida el pronóstico en el backend para la planeación de recursos.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirm} loading={loading}>Confirmar Pronóstico</Button>
        </div>
      </Card>
    </div>
  );
}
