import { useState } from 'react';
import { Card, Select, Button, Loader } from '../../../shared/components';
import { useCambiarEstadoOrdenCompra } from '../hooks/useCambiarEstadoOrdenCompra';
import type { EstadoOrden } from '../types/orden-compra.types';

interface CambiarEstadoOrdenDialogProps {
  idOrdenCompra: number;
  estadoActual?: EstadoOrden;
  onClose: () => void;
  onSuccess: () => void;
}

export function CambiarEstadoOrdenDialog({ idOrdenCompra, estadoActual, onClose, onSuccess }: CambiarEstadoOrdenDialogProps) {
  const { cambiarEstado, loading, error } = useCambiarEstadoOrdenCompra();
  const [nuevoEstado, setNuevoEstado] = useState<EstadoOrden>(estadoActual || 'BORRADOR');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cambiarEstado(idOrdenCompra, nuevoEstado);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title={`Cambiar Estado: Orden #${idOrdenCompra}`}>
        <form onSubmit={handleSubmit}>
          <Select
            label="Nuevo Estado"
            value={nuevoEstado}
            onChange={(e) => setNuevoEstado(e.target.value as EstadoOrden)}
            options={[
              { value: 'BORRADOR', label: 'Borrador' },
              { value: 'EMITIDA', label: 'Emitida' },
              { value: 'RECIBIDA', label: 'Recibida' },
              { value: 'CANCELADA', label: 'Cancelada' },
            ]}
          />

          {error && <div className="error-message">{error}</div>}
          {loading && <Loader />}

          <div className="modal-actions">
            <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
            <Button variant="primary" type="submit">Actualizar Estado</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
