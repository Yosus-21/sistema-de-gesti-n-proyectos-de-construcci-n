import { Card, Button } from '../../../shared/components';
import { useConfirmarRecepcionMaterial } from '../hooks/useConfirmarRecepcionMaterial';

interface ConfirmarRecepcionDialogProps {
  idEntregaMaterial: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConfirmarRecepcionDialog({ idEntregaMaterial, onClose, onSuccess }: ConfirmarRecepcionDialogProps) {
  const { confirmarRecepcion, loading, error } = useConfirmarRecepcionMaterial();

  const handleConfirm = async () => {
    try {
      await confirmarRecepcion(idEntregaMaterial);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title="Confirmar Recepción de Material">
        <div className="warning-banner">
          <p><strong>Atención:</strong> Esta acción actualizará el stock del material en inventario y puede marcar la orden de compra como <strong>RECIBIDA</strong> si todas sus líneas han sido completadas.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirm} loading={loading}>Confirmar Recepción</Button>
        </div>
      </Card>
    </div>
  );
}
