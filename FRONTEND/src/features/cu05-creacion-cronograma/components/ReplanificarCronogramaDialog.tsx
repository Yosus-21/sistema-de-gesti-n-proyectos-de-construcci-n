import { useState, type ChangeEvent } from 'react';
import { Button, Input } from '../../../shared/components';
import type { ReplanificarCronogramaDto, Cronograma } from '../types/cronograma.types';

interface ReplanificarCronogramaDialogProps {
  open: boolean;
  cronograma: Cronograma;
  onConfirm: (data: ReplanificarCronogramaDto) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ReplanificarCronogramaDialog({
  open,
  cronograma,
  onConfirm,
  onCancel,
  loading = false,
}: ReplanificarCronogramaDialogProps) {
  const [values, setValues] = useState<ReplanificarCronogramaDto>({
    fechaInicio: cronograma.fechaInicio?.split('T')[0] || '',
    fechaFin: cronograma.fechaFin?.split('T')[0] || '',
    motivoReplanificacion: '',
    accionesAnteRetraso: cronograma.accionesAnteRetraso || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const handleChange = (field: keyof ReplanificarCronogramaDto) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleConfirm = () => {
    const newErrors: Record<string, string> = {};
    if (!values.motivoReplanificacion.trim()) {
      newErrors.motivoReplanificacion = 'El motivo de replanificación es obligatorio';
    }
    if (values.fechaInicio && values.fechaFin) {
      if (new Date(values.fechaFin) < new Date(values.fechaInicio)) {
        newErrors.fechaFin = 'La fecha fin no puede ser anterior a la de inicio';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onConfirm({
      ...values,
      motivoReplanificacion: values.motivoReplanificacion.trim(),
      accionesAnteRetraso: values.accionesAnteRetraso?.trim() || undefined,
    });
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content" style={{ maxWidth: '600px' }}>
        <h3 className="dialog-title">Replanificar Cronograma</h3>
        <p className="dialog-message">
          Actualice las fechas y proporcione el motivo de la replanificación.
        </p>

        <div className="form-row" style={{ marginTop: '1rem' }}>
          <Input
            label="Nueva Fecha Inicio"
            type="date"
            value={values.fechaInicio}
            onChange={handleChange('fechaInicio')}
            error={errors.fechaInicio}
          />
          <Input
            label="Nueva Fecha Fin"
            type="date"
            value={values.fechaFin}
            onChange={handleChange('fechaFin')}
            error={errors.fechaFin}
          />
        </div>

        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label className="input-label">Motivo de Replanificación *</label>
          <textarea
            className={`input-field ${errors.motivoReplanificacion ? 'error' : ''}`}
            rows={3}
            value={values.motivoReplanificacion}
            onChange={handleChange('motivoReplanificacion')}
            placeholder="Explique por qué se está replanificando..."
          />
          {errors.motivoReplanificacion && (
            <span className="error-message">{errors.motivoReplanificacion}</span>
          )}
        </div>

        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label className="input-label">Acciones ante Retraso</label>
          <textarea
            className="input-field"
            rows={3}
            value={values.accionesAnteRetraso}
            onChange={handleChange('accionesAnteRetraso')}
            placeholder="Actualice el plan de acción si es necesario..."
          />
        </div>

        <div className="dialog-actions" style={{ marginTop: '1.5rem' }}>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirm} loading={loading}>
            Confirmar Replanificación
          </Button>
        </div>
      </div>
    </div>
  );
}
