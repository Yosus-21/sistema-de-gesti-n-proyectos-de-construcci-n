import { useState } from 'react';
import { Card, Input, Button, Loader } from '../../../shared/components';
import { useActualizarStockMaterial } from '../hooks/useActualizarStockMaterial';

interface ActualizarStockDialogProps {
  idMaterial: number;
  nombreMaterial: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function ActualizarStockDialog({ idMaterial, nombreMaterial, onClose, onSuccess }: ActualizarStockDialogProps) {
  const { actualizarStock, loading, error } = useActualizarStockMaterial();
  const [formData, setFormData] = useState({
    cantidad: 0,
    motivo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await actualizarStock(idMaterial, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title={`Actualizar Stock: ${nombreMaterial}`}>
        <form onSubmit={handleSubmit}>
          <p className="helper-text">
            Ingresa una cantidad positiva para sumar al inventario o negativa para restar.
          </p>
          
          <Input
            label="Cantidad (Ajuste)"
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={(e) => setFormData(p => ({ ...p, cantidad: Number(e.target.value) }))}
            required
          />
          
          <div className="form-full">
            <label className="input-label">Motivo (Opcional)</label>
            <textarea
              className="form-textarea"
              value={formData.motivo}
              onChange={(e) => setFormData(p => ({ ...p, motivo: e.target.value }))}
              placeholder="Ej: Ingreso por compra, Merma, Uso en obra..."
              rows={2}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {loading && <Loader />}

          <div className="modal-actions">
            <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
            <Button variant="primary" type="submit" disabled={formData.cantidad === 0}>
              Confirmar Ajuste
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
