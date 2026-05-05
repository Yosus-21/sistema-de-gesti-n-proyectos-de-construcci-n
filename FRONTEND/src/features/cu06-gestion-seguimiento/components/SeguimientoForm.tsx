import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Card, Input, Select, Button } from '../../../shared/components';
import { tareasObraFinaService } from '../../cu03-gestion-tareas-obra-fina/services/tareas-obra-fina.service';
import { tareasObraBrutaService } from '../../cu04-gestion-tareas-obra-bruta/services/tareas-obra-bruta.service';
import type { Seguimiento, RegistrarSeguimientoDto, ModificarSeguimientoDto } from '../types/seguimiento.types';

interface SeguimientoFormProps {
  initialData?: Seguimiento;
  onSubmit: (data: RegistrarSeguimientoDto | ModificarSeguimientoDto) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function SeguimientoForm({ initialData, onSubmit, loading, isEdit }: SeguimientoFormProps) {
  const [values, setValues] = useState({
    idTarea: initialData?.idTarea?.toString() || '',
    fechaSeguimiento: initialData?.fechaSeguimiento?.split('T')[0] || new Date().toISOString().split('T')[0],
    porcentajeAvance: initialData?.porcentajeAvance?.toString() || '0',
    observaciones: initialData?.observaciones || '',
    fechaInicioReal: initialData?.fechaInicioReal?.split('T')[0] || '',
    fechaFinReal: initialData?.fechaFinReal?.split('T')[0] || '',
  });

  const [tareas, setTareas] = useState<{ label: string; value: number }[]>([]);
  const [loadingTareas, setLoadingTareas] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isEdit) {
      const fetchTareas = async () => {
        setLoadingTareas(true);
        try {
          const [fina, bruta] = await Promise.all([
            tareasObraFinaService.listarTareasObraFina(),
            tareasObraBrutaService.listarTareasObraBruta(),
          ]);

          const unified = [
            ...fina.map(t => ({ label: `[Obra Fina] ${t.nombre}`, value: t.idTarea })),
            ...bruta.map(t => ({ label: `[Obra Bruta] ${t.nombre}`, value: t.idTarea })),
          ];
          setTareas(unified);
        } catch (err) {
          console.error('Error cargando tareas para selector:', err);
        } finally {
          setLoadingTareas(false);
        }
      };
      fetchTareas();
    }
  }, [isEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!isEdit && !values.idTarea) errors.idTarea = 'La tarea es obligatoria';
    if (!values.fechaSeguimiento) errors.fechaSeguimiento = 'La fecha es obligatoria';
    
    const avance = Number(values.porcentajeAvance);
    if (isNaN(avance) || avance < 0 || avance > 100) {
      errors.porcentajeAvance = 'El porcentaje debe estar entre 0 y 100';
    }

    if (values.fechaInicioReal && values.fechaFinReal) {
      if (new Date(values.fechaFinReal) < new Date(values.fechaInicioReal)) {
        errors.fechaFinReal = 'La fecha fin real no puede ser anterior a la inicio real';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit) {
      const dto: ModificarSeguimientoDto = {
        fechaSeguimiento: values.fechaSeguimiento,
        porcentajeAvance: Number(values.porcentajeAvance),
        observaciones: values.observaciones || undefined,
        fechaInicioReal: values.fechaInicioReal || undefined,
        fechaFinReal: values.fechaFinReal || undefined,
      };
      onSubmit(dto);
    } else {
      const dto: RegistrarSeguimientoDto = {
        idTarea: Number(values.idTarea),
        fechaSeguimiento: values.fechaSeguimiento,
        porcentajeAvance: Number(values.porcentajeAvance),
        observaciones: values.observaciones || undefined,
        fechaInicioReal: values.fechaInicioReal || undefined,
        fechaFinReal: values.fechaFinReal || undefined,
      };
      onSubmit(dto);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="seguimiento-form">
        <div className="form-grid">
          {!isEdit && (
            <Select
              label="Tarea *"
              name="idTarea"
              value={values.idTarea}
              onChange={handleChange}
              options={tareas}
              placeholder={loadingTareas ? "Cargando tareas..." : "Seleccione una tarea"}
              error={fieldErrors.idTarea}
              required
            />
          )}

          <Input
            label="Fecha Seguimiento *"
            name="fechaSeguimiento"
            type="date"
            value={values.fechaSeguimiento}
            onChange={handleChange}
            error={fieldErrors.fechaSeguimiento}
            required
          />

          <Input
            label="Porcentaje Avance (%) *"
            name="porcentajeAvance"
            type="number"
            min="0"
            max="100"
            value={values.porcentajeAvance}
            onChange={handleChange}
            error={fieldErrors.porcentajeAvance}
            required
          />

          <div className="empty-space" />

          <Input
            label="Fecha Inicio Real"
            name="fechaInicioReal"
            type="date"
            value={values.fechaInicioReal}
            onChange={handleChange}
            error={fieldErrors.fechaInicioReal}
          />

          <Input
            label="Fecha Fin Real"
            name="fechaFinReal"
            type="date"
            value={values.fechaFinReal}
            onChange={handleChange}
            error={fieldErrors.fechaFinReal}
          />
        </div>

        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label className="input-label">Observaciones</label>
          <textarea
            name="observaciones"
            className="input-field"
            rows={3}
            value={values.observaciones}
            onChange={handleChange}
            placeholder="Notas sobre el avance..."
          />
        </div>

        <div className="form-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Actualizar Seguimiento' : 'Registrar Seguimiento'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
