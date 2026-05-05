import { useState, useEffect } from 'react';
import { Button, Input, Select, Loader, Card } from '../../../shared/components';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import { tareasObraFinaService } from '../../cu03-gestion-tareas-obra-fina/services/tareas-obra-fina.service';
import { tareasObraBrutaService } from '../../cu04-gestion-tareas-obra-bruta/services/tareas-obra-bruta.service';
import type { GenerarPropuestaAsignacionMaterialDto } from '../types/asignacion-material-ia.types';

interface GenerarPropuestaAsignacionMaterialFormProps {
  onSubmit: (data: GenerarPropuestaAsignacionMaterialDto) => void;
  loading?: boolean;
  onCancel: () => void;
}

export function GenerarPropuestaAsignacionMaterialForm({ onSubmit, loading, onCancel }: GenerarPropuestaAsignacionMaterialFormProps) {
  const [formData, setFormData] = useState<GenerarPropuestaAsignacionMaterialDto>({
    idProyecto: undefined,
    idTarea: undefined,
    costoMaximoPermitido: undefined,
    restricciones: '',
  });

  const [proyectos, setProyectos] = useState<{ value: number; label: string }[]>([]);
  const [tareas, setTareas] = useState<{ value: number; label: string }[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projs, tasksFina, tasksBruta] = await Promise.all([
          proyectosService.listarProyectos(),
          tareasObraFinaService.listarTareasObraFina(),
          tareasObraBrutaService.listarTareasObraBruta()
        ]);
        
        setProyectos(projs.map(p => ({ value: p.idProyecto, label: p.nombre })));
        
        const allTasks = [
          ...tasksFina.map(t => ({ value: t.idTarea, label: `(Fina) ${t.nombre}` })),
          ...tasksBruta.map(t => ({ value: t.idTarea, label: `(Bruta) ${t.nombre}` }))
        ];
        setTareas(allTasks);
      } catch (error) {
        console.error('Error fetching lists:', error);
      } finally {
        setLoadingLists(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'idProyecto' || name === 'idTarea' || name === 'costoMaximoPermitido') 
        ? (value === '' ? undefined : Number(value)) 
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loadingLists) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="ia-form">
      <Card className="ia-info-card">
        <p><strong>Nota:</strong> La propuesta será generada por el backend. Si la IA está deshabilitada o falla, se usará fallback heurístico seguro.</p>
      </Card>

      <div className="form-grid">
        <Select
          label="Proyecto (Opcional)"
          name="idProyecto"
          value={formData.idProyecto || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Cualquier proyecto' },
            ...proyectos
          ]}
        />
        <Select
          label="Tarea (Opcional)"
          name="idTarea"
          value={formData.idTarea || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Cualquier tarea' },
            ...tareas
          ]}
        />
        <Input
          label="Costo Máximo Permitido"
          name="costoMaximoPermitido"
          type="number"
          value={formData.costoMaximoPermitido || ''}
          onChange={handleChange}
          min={0}
          placeholder="Sin límite"
        />
      </div>

      <div className="form-full">
        <label className="input-label">Restricciones Específicas</label>
        <textarea
          name="restricciones"
          value={formData.restricciones}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
          placeholder="Ej: Solo materiales locales, evitar desperdicio > 5%..."
        />
      </div>

      <div className="form-actions">
        <Button variant="ghost" onClick={onCancel} type="button">Cancelar</Button>
        <Button variant="primary" type="submit" loading={loading}>Generar Propuesta IA</Button>
      </div>
    </form>
  );
}
