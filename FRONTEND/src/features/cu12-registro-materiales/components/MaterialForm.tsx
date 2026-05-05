import { useState } from 'react';
import { Button, Input, Select } from '../../../shared/components';
import type { Material, RegistrarMaterialDto, TipoMaterial } from '../types/material.types';

interface MaterialFormProps {
  initialData?: Material;
  onSubmit: (data: RegistrarMaterialDto) => void;
  loading?: boolean;
  onCancel: () => void;
}

const TIPOS_MATERIAL: { value: TipoMaterial; label: string }[] = [
  { value: 'CEMENTO', label: 'Cemento' },
  { value: 'ARENA', label: 'Arena' },
  { value: 'GRAVA', label: 'Grava' },
  { value: 'LADRILLO', label: 'Ladrillo' },
  { value: 'ACERO', label: 'Acero' },
  { value: 'MADERA', label: 'Madera' },
  { value: 'VIDRIO', label: 'Vidrio' },
  { value: 'PINTURA', label: 'Pintura' },
  { value: 'HERRAMIENTA', label: 'Herramienta' },
  { value: 'OTRO', label: 'Otro' },
];

export function MaterialForm({ initialData, onSubmit, loading, onCancel }: MaterialFormProps) {
  const [formData, setFormData] = useState<RegistrarMaterialDto>({
    nombre: initialData?.nombre || '',
    descripcion: initialData?.descripcion || '',
    tipoMaterial: initialData?.tipoMaterial || 'OTRO',
    unidadMedida: initialData?.unidadMedida || '',
    cantidadDisponible: initialData?.cantidadDisponible || 0,
    stockMinimo: initialData?.stockMinimo || 0,
    costoUnitario: initialData?.costoUnitario || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="material-form">
      <div className="form-grid">
        <Input
          label="Nombre del Material"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <Select
          label="Tipo de Material"
          name="tipoMaterial"
          value={formData.tipoMaterial}
          onChange={handleChange}
          options={TIPOS_MATERIAL}
        />
        <Input
          label="Unidad de Medida (Ej: kg, m2, m3, pieza)"
          name="unidadMedida"
          value={formData.unidadMedida}
          onChange={handleChange}
        />
        <Input
          label="Cantidad Inicial / Disponible"
          name="cantidadDisponible"
          type="number"
          value={formData.cantidadDisponible}
          onChange={handleChange}
          min={0}
        />
        <Input
          label="Stock Mínimo Alerta"
          name="stockMinimo"
          type="number"
          value={formData.stockMinimo}
          onChange={handleChange}
          min={0}
        />
        <Input
          label="Costo Unitario (Sugerido)"
          name="costoUnitario"
          type="number"
          step="0.01"
          value={formData.costoUnitario}
          onChange={handleChange}
          min={0}
        />
      </div>
      <div className="form-full">
        <label className="input-label">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
        />
      </div>
      <div className="form-actions">
        <Button variant="ghost" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button variant="primary" type="submit" loading={loading}>
          {initialData ? 'Actualizar Material' : 'Registrar Material'}
        </Button>
      </div>
    </form>
  );
}
