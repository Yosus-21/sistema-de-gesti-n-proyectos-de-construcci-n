import { Card, Button } from '../../../shared/components';
import { useConfirmarAsignacionMaterial } from '../hooks/useConfirmarAsignacionMaterial';

interface ConfirmarAsignacionMaterialDialogProps {
  idAsignacionMaterial: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConfirmarAsignacionMaterialDialog({ idAsignacionMaterial, onClose, onSuccess }: ConfirmarAsignacionMaterialDialogProps) {
  const { confirmarAsignacion, loading, error } = useConfirmarAsignacionMaterial();

  const handleConfirm = async () => {
    try {
      await confirmarAsignacion(idAsignacionMaterial);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title="Confirmar Asignación de Material">
        <div className="warning-banner">
          <p><strong>Atención:</strong> Confirmar esta asignación puede descontar inventario según la lógica del backend y consolidar el uso de estos materiales para la tarea seleccionada.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirm} loading={loading}>Confirmar Asignación</Button>
        </div>
      </Card>
    </div>
  );
}
