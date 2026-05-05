import { useState, useEffect, type FormEvent } from 'react';
import { Input, Select, Button } from '../../../shared/components';
import { tareasObraBrutaService } from '../../cu04-gestion-tareas-obra-bruta/services/tareas-obra-bruta.service';
import { trabajadoresService } from '../../cu08-gestion-trabajador/services/trabajadores.service';
import type { CrearAsignacionObraBrutaDto, ModificarAsignacionObraBrutaDto, AsignacionObraBruta } from '../types/asignacion-obra-bruta.types';

interface AsignacionObraBrutaFormProps {
  initialData?: AsignacionObraBruta;
  onSubmit: (data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  loading: boolean;
  onCancel: () => void;
}

export function AsignacionObraBrutaForm({ initialData, onSubmit, loading, onCancel }: AsignacionObraBrutaFormProps) {
  const [formData, setFormData] = useState({
    idTarea: initialData?.idTarea || '',
    idTrabajador: initialData?.idTrabajador || '',
    observaciones: initialData?.observaciones || '',
  });

  const [tareas, setTareas] = useState<{ label: string; value: number }[]>([]);
  const [trabajadores, setTrabajadores] = useState<{ label: string; value: number }[]>([]);
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      tareasObraBrutaService.listarTareasObraBruta(),
      trabajadoresService.listarTrabajadores()
    ]).then(([tareasData, workersData]) => {
      if (cancelled) return;
      setTareas(tareasData.map(t => ({ label: t.nombre, value: t.idTarea })));
      // Filter workers for Obra Bruta (ALBANIL, PLOMERO, ELECTRICISTA)
      const validOcupaciones = ['ALBANIL', 'PLOMERO', 'ELECTRICISTA'];
      const filteredWorkers = workersData.filter(w => validOcupaciones.includes(w.ocupacion));
      setTrabajadores(filteredWorkers.map(w => ({ 
        label: `${w.nombres} ${w.apellidos || ''} (${w.ocupacion})`, 
        value: w.idTrabajador 
      })));
    }).catch(console.error).finally(() => {
      if (!cancelled) setLoadingMetadata(false);
    });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (initialData) {
      onSubmit({
        idTrabajador: Number(formData.idTrabajador),
        observaciones: formData.observaciones,
      } as ModificarAsignacionObraBrutaDto);
    } else {
      onSubmit({
        idTarea: Number(formData.idTarea),
        idTrabajador: Number(formData.idTrabajador),
        observaciones: formData.observaciones,
      } as CrearAsignacionObraBrutaDto);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {!initialData && (
        <Select
          label="Tarea de Obra Bruta"
          value={formData.idTarea}
          onChange={(e) => setFormData(prev => ({ ...prev, idTarea: e.target.value }))}
          options={tareas}
          required
          placeholder="Seleccione una tarea"
          disabled={loadingMetadata}
        />
      )}
      <Select
        label="Trabajador"
        value={formData.idTrabajador}
        onChange={(e) => setFormData(prev => ({ ...prev, idTrabajador: e.target.value }))}
        options={trabajadores}
        required
        placeholder="Seleccione un trabajador"
        disabled={loadingMetadata}
      />
      <Input
        label="Observaciones"
        value={formData.observaciones}
        onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
        placeholder="Opcional: detalles de la asignación"
      />
      <div className="form-actions">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={loading || loadingMetadata}>
          {initialData ? 'Actualizar' : 'Crear'} Asignación
        </Button>
      </div>
    </form>
  );
}
