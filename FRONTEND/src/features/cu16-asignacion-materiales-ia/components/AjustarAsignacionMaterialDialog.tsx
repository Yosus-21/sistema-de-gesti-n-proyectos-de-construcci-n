import { useState } from 'react';
import { Card, Button, Input } from '../../../shared/components';
import { useAjustarAsignacionMaterial } from '../hooks/useAjustarAsignacionMaterial';
import type { AsignacionMaterialIa } from '../types/asignacion-material-ia.types';

interface AjustarAsignacionMaterialDialogProps {
  asignacion: AsignacionMaterialIa;
  onClose: () => void;
  onSuccess: () => void;
}

export function AjustarAsignacionMaterialDialog({ asignacion, onClose, onSuccess }: AjustarAsignacionMaterialDialogProps) {
  const { ajustarAsignacion, loading, error } = useAjustarAsignacionMaterial();
  const [formData, setFormData] = useState({
    cantidadAsignada: asignacion.cantidadAsignada || 0,
    costoEstimado: asignacion.costoEstimado || 0,
    restricciones: asignacion.restricciones || '',
    observaciones: asignacion.observaciones || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'cantidadAsignada' || name === 'costoEstimado') ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ajustarAsignacion(asignacion.idAsignacionMaterial, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title={`Ajustar Asignación #${asignacion.idAsignacionMaterial}`}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Input
              label="Cantidad Asignada"
              name="cantidadAsignada"
              type="number"
              value={formData.cantidadAsignada}
              onChange={handleChange}
              required
              min={1}
            />
            <Input
              label="Costo Estimado ($)"
              name="costoEstimado"
              type="number"
              value={formData.costoEstimado}
              onChange={handleChange}
              required
              min={0}
            />
          </div>
          
          <div className="form-full" style={{ marginTop: '1rem' }}>
            <label className="input-label">Restricciones / Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="form-textarea"
              rows={3}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
            <Button variant="primary" type="submit" loading={loading}>Guardar Ajustes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
