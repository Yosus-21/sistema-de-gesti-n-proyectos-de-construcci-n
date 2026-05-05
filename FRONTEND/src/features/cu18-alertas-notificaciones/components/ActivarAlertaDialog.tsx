import { ConfirmDialog } from '../../../shared/components';
import { useActivarAlerta } from '../hooks/useActivarAlerta';

interface ActivarAlertaDialogProps {
  idAlerta: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ActivarAlertaDialog({ idAlerta, isOpen, onClose, onSuccess }: ActivarAlertaDialogProps) {
  const { activarAlerta, loading } = useActivarAlerta();

  const handleConfirm = async () => {
    try {
      await activarAlerta(idAlerta);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error activating alert:', error);
    }
  };

  return (
    <ConfirmDialog
      open={isOpen}
      title="Activar Alerta"
      message={`¿Está seguro de que desea activar la alerta #${idAlerta}? Comenzará a monitorear según su configuración.`}
      onConfirm={handleConfirm}
      onCancel={onClose}
      loading={loading}
      confirmText="Activar"
    />
  );
}
