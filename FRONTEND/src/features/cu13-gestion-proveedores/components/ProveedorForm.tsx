import { useState } from 'react';
import { Button, Input } from '../../../shared/components';
import type { Proveedor, RegistrarProveedorDto } from '../types/proveedor.types';

interface ProveedorFormProps {
  initialData?: Proveedor;
  onSubmit: (data: RegistrarProveedorDto) => void;
  loading?: boolean;
  onCancel: () => void;
}

export function ProveedorForm({ initialData, onSubmit, loading, onCancel }: ProveedorFormProps) {
  const [formData, setFormData] = useState<RegistrarProveedorDto>({
    nombre: initialData?.nombre || '',
    correo: initialData?.correo || '',
    telefono: initialData?.telefono || '',
    direccion: initialData?.direccion || '',
    nit: initialData?.nit || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="proveedor-form">
      <div className="form-grid">
        <Input
          label="Nombre del Proveedor"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <Input
          label="Correo Electrónico"
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
        />
        <Input
          label="Teléfono"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
        />
        <Input
          label="NIT"
          name="nit"
          value={formData.nit}
          onChange={handleChange}
        />
        <Input
          label="Dirección"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className="form-full"
        />
      </div>
      <div className="form-actions">
        <Button variant="ghost" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button variant="primary" type="submit" loading={loading}>
          {initialData ? 'Actualizar Proveedor' : 'Registrar Proveedor'}
        </Button>
      </div>
    </form>
  );
}
