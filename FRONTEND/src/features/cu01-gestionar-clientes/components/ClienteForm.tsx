import { useState, type FormEvent } from 'react';
import { Card, Input, Select, Button } from '../../../shared/components';
import type { RegistrarClienteDto } from '../types/cliente.types';

const TIPO_CLIENTE_OPTIONS = [
  { label: 'Persona Natural', value: 'NATURAL' },
  { label: 'Empresa', value: 'EMPRESA' },
  { label: 'Gobierno', value: 'GOBIERNO' },
];

interface ClienteFormValues {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  tipoCliente: string;
}

interface ClienteFormProps {
  initialValues?: Partial<ClienteFormValues>;
  submitLabel?: string;
  loading?: boolean;
  onSubmit: (data: RegistrarClienteDto) => void;
}

function validate(values: ClienteFormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!values.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio';
  }
  if (values.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo)) {
    errors.correo = 'Ingresa un correo válido';
  }
  return errors;
}

export function ClienteForm({
  initialValues = {},
  submitLabel = 'Guardar',
  loading = false,
  onSubmit,
}: ClienteFormProps) {
  const [values, setValues] = useState<ClienteFormValues>({
    nombre: initialValues.nombre ?? '',
    correo: initialValues.correo ?? '',
    telefono: initialValues.telefono ?? '',
    direccion: initialValues.direccion ?? '',
    tipoCliente: initialValues.tipoCliente ?? '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ClienteFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    const payload: RegistrarClienteDto = {
      nombre: values.nombre.trim(),
      correo: values.correo.trim() || undefined,
      telefono: values.telefono.trim() || undefined,
      direccion: values.direccion.trim() || undefined,
      tipoCliente: values.tipoCliente || undefined,
    };
    onSubmit(payload);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="cliente-form" noValidate>
        <div className="form-row">
          <Input
            label="Nombre"
            value={values.nombre}
            onChange={handleChange('nombre')}
            error={fieldErrors.nombre}
            required
            placeholder="Nombre completo o razón social"
          />
          <Input
            label="Correo electrónico"
            type="email"
            value={values.correo}
            onChange={handleChange('correo')}
            error={fieldErrors.correo}
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div className="form-row">
          <Input
            label="Teléfono"
            type="tel"
            value={values.telefono}
            onChange={handleChange('telefono')}
            placeholder="Ej: +58 414 000 0000"
          />
          <Select
            label="Tipo de cliente"
            value={values.tipoCliente}
            onChange={handleChange('tipoCliente')}
            options={TIPO_CLIENTE_OPTIONS}
            placeholder="Selecciona un tipo..."
          />
        </div>
        <Input
          label="Dirección"
          value={values.direccion}
          onChange={handleChange('direccion')}
          placeholder="Dirección completa"
        />
        <div className="form-actions">
          <Button type="submit" loading={loading}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Card>
  );
}
