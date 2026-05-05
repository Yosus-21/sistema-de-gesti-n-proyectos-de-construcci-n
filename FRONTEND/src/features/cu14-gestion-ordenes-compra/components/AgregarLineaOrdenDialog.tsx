import { useState, useEffect } from 'react';
import { Card, Input, Select, Button, Loader } from '../../../shared/components';
import { materialesService } from '../../cu12-registro-materiales/services/materiales.service';
import { useAgregarLineaOrdenCompra } from '../hooks/useAgregarLineaOrdenCompra';
import type { AgregarLineaOrdenCompraDto } from '../types/orden-compra.types';

interface AgregarLineaOrdenDialogProps {
  idOrdenCompra: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function AgregarLineaOrdenDialog({ idOrdenCompra, onClose, onSuccess }: AgregarLineaOrdenDialogProps) {
  const { agregarLinea, loading: adding, error } = useAgregarLineaOrdenCompra();
  const [formData, setFormData] = useState<AgregarLineaOrdenCompraDto>({
    idMaterial: 0,
    cantidadSolicitada: 0,
    precioUnitarioAcordado: 0,
  });

  const [materiales, setMateriales] = useState<{ value: number; label: string }[]>([]);
  const [loadingMat, setLoadingMat] = useState(true);

  useEffect(() => {
    materialesService.listarMateriales()
      .then(data => {
        setMateriales(data.map(m => ({ value: m.idMaterial, label: m.nombre })));
      })
      .finally(() => setLoadingMat(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.idMaterial === 0) return;
    try {
      await agregarLinea(idOrdenCompra, formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title="Agregar Línea de Pedido">
        {loadingMat ? <Loader /> : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <Select
                label="Material"
                name="idMaterial"
                value={formData.idMaterial}
                onChange={handleChange}
                options={[
                  { value: 0, label: 'Seleccione un material' },
                  ...materiales
                ]}
                required
              />
              <Input
                label="Cantidad Solicitada"
                name="cantidadSolicitada"
                type="number"
                value={formData.cantidadSolicitada}
                onChange={handleChange}
                min={0.01}
                step="0.01"
                required
              />
              <Input
                label="Precio Unitario Acordado"
                name="precioUnitarioAcordado"
                type="number"
                value={formData.precioUnitarioAcordado}
                onChange={handleChange}
                min={0}
                step="0.01"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
              <Button variant="primary" type="submit" loading={adding} disabled={formData.idMaterial === 0 || formData.cantidadSolicitada <= 0}>
                Agregar Línea
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
