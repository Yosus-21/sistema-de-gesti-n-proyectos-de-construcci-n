import { useState } from 'react';
import { Card, Button, Input } from '../../../shared/components';
import { useAjustarPronosticoMaterial } from '../hooks/useAjustarPronosticoMaterial';
import type { PronosticoMaterialIa } from '../types/pronostico-material-ia.types';

interface AjustarPronosticoMaterialDialogProps {
  pronostico: PronosticoMaterialIa;
  onClose: () => void;
  onSuccess: () => void;
}

export function AjustarPronosticoMaterialDialog({ pronostico, onClose, onSuccess }: AjustarPronosticoMaterialDialogProps) {
  const { ajustarPronostico, loading, error } = useAjustarPronosticoMaterial();
  const [formData, setFormData] = useState({
    stockMinimo: pronostico.stockMinimo || 0,
    stockMaximo: pronostico.stockMaximo || 0,
    observaciones: pronostico.observaciones || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'stockMinimo' || name === 'stockMaximo') ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.stockMaximo < formData.stockMinimo) {
      alert('Stock máximo no puede ser menor al mínimo');
      return;
    }
    try {
      await ajustarPronostico(pronostico.idPronosticoMaterial, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title={`Ajustar Pronóstico #${pronostico.idPronosticoMaterial}`}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <Input
              label="Stock Mínimo"
              name="stockMinimo"
              type="number"
              value={formData.stockMinimo}
              onChange={handleChange}
              required
              min={0}
            />
            <Input
              label="Stock Máximo"
              name="stockMaximo"
              type="number"
              value={formData.stockMaximo}
              onChange={handleChange}
              required
              min={formData.stockMinimo}
            />
          </div>
          
          <div className="form-full" style={{ marginTop: '1rem' }}>
            <label className="input-label">Observaciones</label>
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
