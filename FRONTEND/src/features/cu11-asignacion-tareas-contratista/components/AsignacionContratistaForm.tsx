import { useState, useEffect, type FormEvent } from 'react';
import { Input, Select, Button } from '../../../shared/components';
import { tareasObraBrutaService } from '../../cu04-gestion-tareas-obra-bruta/services/tareas-obra-bruta.service';
import { trabajadoresService } from '../../cu08-gestion-trabajador/services/trabajadores.service';
import type { AsignacionContratista } from '../types/asignacion-contratista.types';

interface AsignacionContratistaFormProps {
  initialData?: AsignacionContratista;
  onSubmit: (data: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  loading?: boolean;
  onCancel: () => void;
}

export function AsignacionContratistaForm({ initialData, onSubmit, loading, onCancel }: AsignacionContratistaFormProps) {
  const isEditing = !!initialData;
  const [formData, setFormData] = useState({
    idTarea: initialData?.idTarea?.toString() || '',
    idTrabajador: initialData?.idTrabajador?.toString() || '',
    idContratista: initialData?.idContratista?.toString() || '',
    observaciones: initialData?.observaciones || '',
  });

  const [tareas, setTareas] = useState<{ label: string; value: number }[]>([]);
  const [trabajadores, setTrabajadores] = useState<{ label: string; value: number }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      tareasObraBrutaService.listarTareasObraBruta(),
      trabajadoresService.listarTrabajadores()
    ]).then(([tareasData, workersData]) => {
      if (cancelled) return;
      setTareas(tareasData.map(t => ({ label: t.nombre, value: t.idTarea })));
      setTrabajadores(workersData.map(w => ({ label: `${w.nombres} ${w.apellidos || ''}`, value: w.idTrabajador })));
    }).catch(console.error).finally(() => {
      if (!cancelled) setLoadingOptions(false);
    });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      idTarea: Number(formData.idTarea),
      idTrabajador: Number(formData.idTrabajador),
      idContratista: Number(formData.idContratista),
      observaciones: formData.observaciones
    });
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <Select
        label="Tarea de Obra Bruta"
        value={formData.idTarea}
        onChange={(e) => setFormData(prev => ({ ...prev, idTarea: e.target.value }))}
        options={tareas}
        required
        disabled={loadingOptions || isEditing}
        placeholder="Seleccione una tarea"
      />
      
      <Select
        label="Trabajador"
        value={formData.idTrabajador}
        onChange={(e) => setFormData(prev => ({ ...prev, idTrabajador: e.target.value }))}
        options={trabajadores}
        required
        disabled={loadingOptions || isEditing}
        placeholder="Seleccione un trabajador"
      />

      <Input
        label="ID Contratista"
        type="number"
        value={formData.idContratista}
        onChange={(e) => setFormData(prev => ({ ...prev, idContratista: e.target.value }))}
        required
        disabled={isEditing}
        placeholder="ID del contratista"
      />

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
