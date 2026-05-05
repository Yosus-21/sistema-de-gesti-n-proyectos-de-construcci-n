import { ConfirmDialog } from '../../../shared/components';
import { useDesactivarAlerta } from '../hooks/useDesactivarAlerta';

interface DesactivarAlertaDialogProps {
  idAlerta: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DesactivarAlertaDialog({ idAlerta, isOpen, onClose, onSuccess }: DesactivarAlertaDialogProps) {
  const { desactivarAlerta, loading } = useDesactivarAlerta();

  const handleConfirm = async () => {
    try {
      await desactivarAlerta(idAlerta);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deactivating alert:', error);
    }
  };

  return (
    <ConfirmDialog
      open={isOpen}
      title="Desactivar Alerta"
      message={`¿Está seguro de que desea desactivar la alerta #${idAlerta}? Dejará de monitorear temporalmente.`}
      onConfirm={handleConfirm}
      onCancel={onClose}
      loading={loading}
      confirmText="Desactivar"
    />
  );
}
