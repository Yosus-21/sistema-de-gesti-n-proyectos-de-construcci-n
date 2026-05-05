import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Card, Input, Select, Button } from '../../../shared/components';
import { OcupacionTrabajador } from '../types/trabajador.types';
import type { RegistrarTrabajadorDto, Trabajador } from '../types/trabajador.types';

interface TrabajadorFormValues {
  nombres: string;
  apellidos: string;
  ci: string;
  correo: string;
  telefono: string;
  direccion: string;
  ocupacion: string;
  tarifaHora: string;
}

interface TrabajadorFormProps {
  initialData?: Trabajador;
  loading?: boolean;
  onSubmit: (data: RegistrarTrabajadorDto) => void | Promise<void>;
  isEdit?: boolean;
}

function validate(values: TrabajadorFormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!values.nombres.trim()) errors.nombres = 'El nombre es obligatorio';
  if (!values.ci.trim()) errors.ci = 'El CI es obligatorio';
  if (!values.ocupacion) errors.ocupacion = 'La ocupación es obligatoria';
  
  if (values.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo)) {
    errors.correo = 'Formato de correo inválido';
  }

  if (values.tarifaHora && isNaN(Number(values.tarifaHora))) {
    errors.tarifaHora = 'La tarifa debe ser un número';
  } else if (values.tarifaHora && Number(values.tarifaHora) < 0) {
    errors.tarifaHora = 'La tarifa no puede ser negativa';
  }

  return errors;
}

const OCUPACION_OPTIONS = [
  { label: 'Albañil', value: OcupacionTrabajador.ALBANIL },
  { label: 'Plomero', value: OcupacionTrabajador.PLOMERO },
  { label: 'Electricista', value: OcupacionTrabajador.ELECTRICISTA },
  { label: 'Vidriero', value: OcupacionTrabajador.VIDRIERO },
  { label: 'Carpintero', value: OcupacionTrabajador.CARPINTERO },
];

export function TrabajadorForm({ initialData, loading = false, onSubmit, isEdit = false }: TrabajadorFormProps) {
  const [values, setValues] = useState<TrabajadorFormValues>({
    nombres: initialData?.nombres || '',
    apellidos: initialData?.apellidos || '',
    ci: initialData?.ci || '',
    correo: initialData?.correo || '',
    telefono: initialData?.telefono || '',
    direccion: initialData?.direccion || '',
    ocupacion: initialData?.ocupacion || '',
    tarifaHora: initialData?.tarifaHora?.toString() || '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof TrabajadorFormValues) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

    const payload: RegistrarTrabajadorDto = {
      nombres: values.nombres.trim(),
      apellidos: values.apellidos.trim() || undefined,
      ci: values.ci.trim(),
      correo: values.correo.trim() || undefined,
      telefono: values.telefono.trim() || undefined,
      direccion: values.direccion.trim() || undefined,
      ocupacion: values.ocupacion as OcupacionTrabajador,
      tarifaHora: values.tarifaHora ? Number(values.tarifaHora) : undefined,
    };

    onSubmit(payload);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="trabajador-form" noValidate>
        <div className="form-row">
          <Input
            label="Nombres *"
            value={values.nombres}
            onChange={handleChange('nombres')}
            error={fieldErrors.nombres}
            required
          />
          <Input
            label="Apellidos"
            value={values.apellidos}
            onChange={handleChange('apellidos')}
            error={fieldErrors.apellidos}
          />
        </div>

        <div className="form-row">
          <Input
            label="CI *"
            value={values.ci}
            onChange={handleChange('ci')}
            error={fieldErrors.ci}
            required
          />
          <Select
            label="Ocupación *"
            value={values.ocupacion}
            onChange={handleChange('ocupacion')}
            options={OCUPACION_OPTIONS}
            error={fieldErrors.ocupacion}
            required
            placeholder="Seleccione ocupación..."
          />
        </div>

        <div className="form-row">
          <Input
            label="Correo Electrónico"
            type="email"
            value={values.correo}
            onChange={handleChange('correo')}
            error={fieldErrors.correo}
          />
          <Input
            label="Teléfono"
            value={values.telefono}
            onChange={handleChange('telefono')}
            error={fieldErrors.telefono}
          />
        </div>

        <div className="form-row">
          <Input
            label="Tarifa por Hora"
            type="number"
            value={values.tarifaHora}
            onChange={handleChange('tarifaHora')}
            error={fieldErrors.tarifaHora}
            placeholder="0.00"
          />
          <div /> {/* Spacer */}
        </div>

        <div className="form-group">
          <label className="input-label">Dirección</label>
          <textarea
            className="input-field"
            rows={3}
            value={values.direccion}
            onChange={handleChange('direccion')}
            placeholder="Dirección de domicilio..."
          />
        </div>

        <div className="form-actions">
          <Button type="submit" loading={loading}>
            {isEdit ? 'Actualizar Trabajador' : 'Registrar Trabajador'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
