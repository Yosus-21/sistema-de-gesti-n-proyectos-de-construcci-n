import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { Card, Input, Select, Button, Loader } from '../../../shared/components';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import type { Proyecto } from '../../cu02-creacion-proyectos/types/proyecto.types';
import type { CrearCronogramaDto } from '../types/cronograma.types';

interface CronogramaFormValues {
  idProyecto: string;
  fechaInicio: string;
  fechaFin: string;
  accionesAnteRetraso: string;
}

interface CronogramaFormProps {
  loading?: boolean;
  onSubmit: (data: CrearCronogramaDto) => void;
}

function validate(values: CronogramaFormValues): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!values.idProyecto) errors.idProyecto = 'El proyecto es obligatorio';
  if (!values.fechaInicio) errors.fechaInicio = 'La fecha de inicio es obligatoria';
  if (!values.fechaFin) errors.fechaFin = 'La fecha fin es obligatoria';
  
  if (values.fechaInicio && values.fechaFin) {
    if (new Date(values.fechaFin) < new Date(values.fechaInicio)) {
      errors.fechaFin = 'La fecha fin no puede ser anterior a la de inicio';
    }
  }

  return errors;
}

export function CronogramaForm({ loading = false, onSubmit }: CronogramaFormProps) {
  const [values, setValues] = useState<CronogramaFormValues>({
    idProyecto: '',
    fechaInicio: '',
    fechaFin: '',
    accionesAnteRetraso: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);
  const [proyectosError, setProyectosError] = useState<string | null>(null);

  useEffect(() => {
    proyectosService.listarProyectos()
      .then(setProyectos)
      .catch((err) => setProyectosError(err instanceof Error ? err.message : 'Error al cargar proyectos'))
      .finally(() => setLoadingProyectos(false));
  }, []);

  const handleChange = (field: keyof CronogramaFormValues) => (
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
    const payload: CrearCronogramaDto = {
      idProyecto: Number(values.idProyecto),
      fechaInicio: values.fechaInicio,
      fechaFin: values.fechaFin,
      fechaInicioPlanificada: values.fechaInicio,
      fechaFinPlanificada: values.fechaFin,
      accionesAnteRetraso: values.accionesAnteRetraso.trim() || undefined,
    };
    onSubmit(payload);
  };

  if (loadingProyectos) return <Loader text="Cargando proyectos..." />;
  if (proyectosError) return <div className="feedback-banner error">{proyectosError}</div>;

  const proyectoOptions = proyectos.map(p => ({
    label: p.nombre,
    value: p.idProyecto
  }));

  return (
    <Card>
      <form onSubmit={handleSubmit} className="cronograma-form" noValidate>
        <div className="form-group">
          <Select
            label="Proyecto"
            value={values.idProyecto}
            onChange={handleChange('idProyecto')}
            options={proyectoOptions}
            error={fieldErrors.idProyecto}
            required
            placeholder="Seleccione un proyecto..."
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
            label="Fecha Fin"
            type="date"
            value={values.fechaFin}
            onChange={handleChange('fechaFin')}
            error={fieldErrors.fechaFin}
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">Acciones ante Retraso</label>
          <textarea
            className="input-field"
            rows={4}
            value={values.accionesAnteRetraso}
            onChange={(e) => setValues(prev => ({ ...prev, accionesAnteRetraso: e.target.value }))}
            placeholder="Plan de acción si ocurren retrasos..."
          />
        </div>

        <div className="form-actions">
          <Button type="submit" loading={loading}>
            Crear Cronograma
          </Button>
        </div>
      </form>
    </Card>
  );
}
