import { useState, useEffect, type FormEvent } from 'react';
import { Input, Select, Button } from '../../../shared/components';
import { tareasObraFinaService } from '../../cu03-gestion-tareas-obra-fina/services/tareas-obra-fina.service';
import { trabajadoresService } from '../../cu08-gestion-trabajador/services/trabajadores.service';
import type { AsignacionObraFina, EstadoAsignacion } from '../types/asignacion-obra-fina.types';

interface AsignacionObraFinaFormProps {
  initialData?: AsignacionObraFina;
  onSubmit: (data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  loading?: boolean;
  onCancel: () => void;
}

export function AsignacionObraFinaForm({ initialData, onSubmit, loading, onCancel }: AsignacionObraFinaFormProps) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    idTarea: initialData?.idTarea?.toString() || '',
    idTrabajador: initialData?.idTrabajador?.toString() || '',
    observaciones: initialData?.observaciones || '',
    estadoAsignacion: initialData?.estadoAsignacion || 'PENDIENTE'
  });

  const [tareas, setTareas] = useState<{ label: string; value: number }[]>([]);
  const [trabajadores, setTrabajadores] = useState<{ label: string; value: number }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      tareasObraFinaService.listarTareasObraFina(),
      trabajadoresService.listarTrabajadores()
    ]).then(([tareasData, workersData]) => {
      if (cancelled) return;
      setTareas(tareasData.map(t => ({ label: t.nombre, value: t.idTarea })));
      // Filter by relevant occupations for Obra Fina if needed
      setTrabajadores(workersData.map(w => ({ label: `${w.nombres} ${w.apellidos || ''} (${w.ocupacion})`, value: w.idTrabajador })));
    }).catch(console.error).finally(() => {
      if (!cancelled) setLoadingOptions(false);
    });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      onSubmit({
        idTrabajador: Number(formData.idTrabajador),
        observaciones: formData.observaciones,
        estadoAsignacion: formData.estadoAsignacion as EstadoAsignacion
      });
    } else {
      onSubmit({
        idTarea: Number(formData.idTarea),
        idTrabajador: Number(formData.idTrabajador),
        observaciones: formData.observaciones
      });
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {!isEditing && (
        <Select
          label="Tarea de Obra Fina"
          value={formData.idTarea}
          onChange={(e) => setFormData(prev => ({ ...prev, idTarea: e.target.value }))}
          options={tareas}
          required
          disabled={loadingOptions}
          placeholder="Seleccione una tarea"
        />
      )}
      
      <Select
        label="Trabajador"
        value={formData.idTrabajador}
        onChange={(e) => setFormData(prev => ({ ...prev, idTrabajador: e.target.value }))}
        options={trabajadores}
        required
        disabled={loadingOptions}
        placeholder="Seleccione un trabajador"
      />

      {isEditing && (
        <Select
          label="Estado"
          value={formData.estadoAsignacion}
          onChange={(e) => setFormData(prev => ({ ...prev, estadoAsignacion: e.target.value as EstadoAsignacion }))}
          options={[
            { label: 'PENDIENTE', value: 'PENDIENTE' },
            { label: 'CONFIRMADA', value: 'CONFIRMADA' },
            { label: 'REASIGNADA', value: 'REASIGNADA' },
            { label: 'CANCELADA', value: 'CANCELADA' }
          ]}
          required
        />
      )}

      <Input
        label="Observaciones"
        value={formData.observaciones}
        onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
        placeholder="Opcional: detalles de la asignación"
      />

      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEditing ? 'Guardar Cambios' : 'Crear Asignación'}
        </Button>
      </div>
    </form>
  );
}
