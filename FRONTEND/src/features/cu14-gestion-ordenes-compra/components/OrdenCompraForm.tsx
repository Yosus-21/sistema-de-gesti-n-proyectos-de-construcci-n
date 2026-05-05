import { useState, useEffect } from 'react';
import { Button, Input, Select, Loader } from '../../../shared/components';
import { proveedoresService } from '../../cu13-gestion-proveedores/services/proveedores.service';
import type { OrdenCompra, CrearOrdenCompraDto } from '../types/orden-compra.types';

interface OrdenCompraFormProps {
  initialData?: OrdenCompra;
  onSubmit: (data: CrearOrdenCompraDto) => void;
  loading?: boolean;
  onCancel: () => void;
}

export function OrdenCompraForm({ initialData, onSubmit, loading, onCancel }: OrdenCompraFormProps) {
  const [formData, setFormData] = useState<CrearOrdenCompraDto>({
    idProveedor: initialData?.idProveedor || 0,
    fechaEmision: initialData?.fechaEmision || new Date().toISOString().split('T')[0],
    fechaEntregaEstimada: initialData?.fechaEntregaEstimada || '',
    observaciones: initialData?.observaciones || '',
  });

  const [proveedores, setProveedores] = useState<{ value: number; label: string }[]>([]);
  const [loadingProv, setLoadingProv] = useState(true);

  useEffect(() => {
    proveedoresService.listarProveedores()
      .then(data => {
        setProveedores(data.map(p => ({ value: p.idProveedor, label: p.nombre })));
      })
      .finally(() => setLoadingProv(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'idProveedor' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loadingProv) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="orden-compra-form">
      <div className="form-grid">
        <Select
          label="Proveedor"
          name="idProveedor"
          value={formData.idProveedor}
          onChange={handleChange}
          options={[
            { value: 0, label: 'Seleccione un proveedor' },
            ...proveedores
          ]}
          required
        />
        <Input
          label="Fecha de Emisión"
          name="fechaEmision"
          type="date"
          value={formData.fechaEmision}
          onChange={handleChange}
          required
        />
        <Input
          label="Fecha Entrega Estimada"
          name="fechaEntregaEstimada"
          type="date"
          value={formData.fechaEntregaEstimada}
          onChange={handleChange}
          min={formData.fechaEmision}
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
        <Button variant="primary" type="submit" loading={loading} disabled={formData.idProveedor === 0}>
          {initialData ? 'Actualizar Orden' : 'Crear Orden'}
        </Button>
      </div>
    </form>
  );
}
