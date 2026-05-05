import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Card, Input, Select, Button, Loader } from '../../../shared/components';
import { clientesService } from '../../cu01-gestionar-clientes/services/clientes.service';
import type { Cliente } from '../../cu01-gestionar-clientes/types/cliente.types';
import type { CrearProyectoDto } from '../types/proyecto.types';

interface ProyectoFormValues {
  idCliente: string;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  presupuesto: string;
  fechaInicio: string;
  fechaFinEstimada: string;
  especificacionesTecnicas: string;
}

interface ProyectoFormProps {
  loading?: boolean;
  onSubmit: (data: CrearProyectoDto) => void;
}

function validate(values: ProyectoFormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!values.idCliente) errors.idCliente = 'El cliente es obligatorio';
  if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio';
  if (!values.fechaInicio) errors.fechaInicio = 'La fecha de inicio es obligatoria';
  if (!values.fechaFinEstimada) errors.fechaFinEstimada = 'La fecha fin estimada es obligatoria';
  
  if (values.fechaInicio && values.fechaFinEstimada) {
    if (new Date(values.fechaFinEstimada) < new Date(values.fechaInicio)) {
      errors.fechaFinEstimada = 'La fecha fin no puede ser anterior a la de inicio';
    }
  }

  if (values.presupuesto && Number(values.presupuesto) < 0) {
    errors.presupuesto = 'El presupuesto no puede ser negativo';
  }

  return errors;
}

export function ProyectoForm({ loading = false, onSubmit }: ProyectoFormProps) {
  const [values, setValues] = useState<ProyectoFormValues>({
    idCliente: '',
    nombre: '',
    descripcion: '',
    ubicacion: '',
    presupuesto: '',
    fechaInicio: '',
    fechaFinEstimada: '',
    especificacionesTecnicas: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [clientesError, setClientesError] = useState<string | null>(null);

  useEffect(() => {
    clientesService.listarClientes()
      .then(setClientes)
      .catch((err) => setClientesError(err instanceof Error ? err.message : 'Error al cargar clientes'))
      .finally(() => setLoadingClientes(false));
  }, []);

  const handleChange = (field: keyof ProyectoFormValues) => (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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
    const payload: CrearProyectoDto = {
      idCliente: Number(values.idCliente),
      nombre: values.nombre.trim(),
      descripcion: values.descripcion.trim() || undefined,
      ubicacion: values.ubicacion.trim() || undefined,
      presupuesto: values.presupuesto ? Number(values.presupuesto) : undefined,
      fechaInicio: values.fechaInicio,
      fechaFinEstimada: values.fechaFinEstimada,
      especificacionesTecnicas: values.especificacionesTecnicas.trim() || undefined,
    };
    onSubmit(payload);
  };

  if (loadingClientes) return <Loader text="Cargando clientes..." />;
  if (clientesError) return <div className="feedback-banner error">{clientesError}</div>;

  const clienteOptions = clientes.map(c => ({
    label: c.nombre,
    value: c.idCliente
  }));

  return (
    <Card>
      <form onSubmit={handleSubmit} className="proyecto-form" noValidate>
        <div className="form-row">
          <Select
            label="Cliente"
            value={values.idCliente}
            onChange={handleChange('idCliente')}
            options={clienteOptions}
            error={fieldErrors.idCliente}
            required
            placeholder="Seleccione un cliente..."
          />
          <Input
            label="Nombre del Proyecto"
            value={values.nombre}
            onChange={handleChange('nombre')}
            error={fieldErrors.nombre}
            required
            placeholder="Nombre descriptivo del proyecto"
          />
        </div>

        <div className="form-row">
          <Input
            label="Ubicación"
            value={values.ubicacion}
            onChange={handleChange('ubicacion')}
            placeholder="Dirección o coordenadas"
          />
          <Input
            label="Presupuesto"
            type="number"
            value={values.presupuesto}
            onChange={handleChange('presupuesto')}
            error={fieldErrors.presupuesto}
            placeholder="0.00"
            min="0"
          />
        </div>

        <div className="form-row">
          <Input
            label="Fecha de Inicio"
            type="date"
            value={values.fechaInicio}
            onChange={handleChange('fechaInicio')}
            error={fieldErrors.fechaInicio}
            required
          />
          <Input
            label="Fecha Fin Estimada"
            type="date"
            value={values.fechaFinEstimada}
            onChange={handleChange('fechaFinEstimada')}
            error={fieldErrors.fechaFinEstimada}
            required
          />
        </div>

        <div className="input-wrapper proyecto-textarea-wrapper">
          <label htmlFor="proyecto-descripcion" className="input-label">Descripción</label>
          <textarea
            id="proyecto-descripcion"
            className="input-field proyecto-textarea"
            rows={3}
            value={values.descripcion}
            onChange={(e) => setValues(prev => ({ ...prev, descripcion: e.target.value }))}
            placeholder="Breve descripción del proyecto"
          />
        </div>

        <div className="input-wrapper proyecto-textarea-wrapper">
          <label htmlFor="proyecto-especificaciones" className="input-label">Especificaciones Técnicas</label>
          <textarea
            id="proyecto-especificaciones"
            className="input-field proyecto-textarea proyecto-textarea-lg"
            rows={4}
            value={values.especificacionesTecnicas}
            onChange={(e) => setValues(prev => ({ ...prev, especificacionesTecnicas: e.target.value }))}
            placeholder="Detalles técnicos, materiales, etc."
          />
        </div>

        <div className="form-actions">
          <Button type="submit" loading={loading}>
            Crear Proyecto
          </Button>
        </div>
      </form>
    </Card>
  );
}
