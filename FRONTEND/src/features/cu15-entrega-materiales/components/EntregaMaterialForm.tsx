import { useState, useEffect } from 'react';
import { Button, Input, Select, Loader } from '../../../shared/components';
import { ordenesCompraService } from '../../cu14-gestion-ordenes-compra/services/ordenes-compra.service';
import { materialesService } from '../../cu12-registro-materiales/services/materiales.service';
import type { RegistrarEntregaMaterialDto } from '../types/entrega-material.types';

interface EntregaMaterialFormProps {
  onSubmit: (data: RegistrarEntregaMaterialDto) => void;
  loading?: boolean;
  onCancel: () => void;
}

export function EntregaMaterialForm({ onSubmit, loading, onCancel }: EntregaMaterialFormProps) {
  const [formData, setFormData] = useState<RegistrarEntregaMaterialDto>({
    idOrdenCompra: 0,
    idMaterial: 0,
    cantidadEntregada: 0,
    fechaEntrega: new Date().toISOString().split('T')[0],
    observaciones: '',
  });

  const [ordenes, setOrdenes] = useState<{ value: number; label: string }[]>([]);
  const [materiales, setMateriales] = useState<{ value: number; label: string }[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  useEffect(() => {
    Promise.all([
      ordenesCompraService.listarOrdenesCompra(),
      materialesService.listarMateriales()
    ]).then(([ords, mats]) => {
      setOrdenes(ords.map(o => ({ value: o.idOrdenCompra, label: `Orden #${o.idOrdenCompra} - ${o.estadoOrden}` })));
      setMateriales(mats.map(m => ({ value: m.idMaterial, label: m.nombre })));
    }).finally(() => setLoadingLists(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'idOrdenCompra' || name === 'idMaterial' || name === 'cantidadEntregada') ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loadingLists) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="entrega-material-form">
      <div className="form-grid">
        <Select
          label="Orden de Compra"
          name="idOrdenCompra"
          value={formData.idOrdenCompra}
          onChange={handleChange}
          options={[
            { value: 0, label: 'Seleccione una orden' },
            ...ordenes
          ]}
          required
        />
        <Select
          label="Material Entregado"
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
          label="Cantidad Entregada"
          name="cantidadEntregada"
          type="number"
          value={formData.cantidadEntregada}
          onChange={handleChange}
          min={0.01}
          step="0.01"
          required
        />
        <Input
          label="Fecha de Entrega"
          name="fechaEntrega"
          type="date"
          value={formData.fechaEntrega}
          onChange={handleChange}
        />
      </div>
      <div className="form-full">
        <label className="input-label">Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
        />
      </div>
      <div className="form-actions">
        <Button variant="ghost" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button variant="primary" type="submit" loading={loading} disabled={formData.idOrdenCompra === 0 || formData.idMaterial === 0 || formData.cantidadEntregada <= 0}>
          Registrar Entrega
        </Button>
      </div>
    </form>
  );
}
