import { useState, useEffect } from 'react';
import { Button, Input, Select, Loader } from '../../../shared/components';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import { tareasObraFinaService } from '../../cu03-gestion-tareas-obra-fina/services/tareas-obra-fina.service';
import { tareasObraBrutaService } from '../../cu04-gestion-tareas-obra-bruta/services/tareas-obra-bruta.service';
import { materialesService } from '../../cu12-registro-materiales/services/materiales.service';
import type { ConfigurarAlertaDto, TipoAlerta, MetodoNotificacion } from '../types/alerta-notificacion.types';

interface AlertaFormProps {
  onSubmit: (data: ConfigurarAlertaDto) => void;
  loading?: boolean;
  onCancel: () => void;
  initialData?: Partial<ConfigurarAlertaDto>;
}

export function AlertaForm({ onSubmit, loading, onCancel, initialData }: AlertaFormProps) {
  const [formData, setFormData] = useState<ConfigurarAlertaDto>({
    tipoAlerta: (initialData?.tipoAlerta || 'MATERIAL_BAJO') as TipoAlerta,
    idProyecto: initialData?.idProyecto,
    idTarea: initialData?.idTarea,
    idMaterial: initialData?.idMaterial,
    mensajeNotificacion: initialData?.mensajeNotificacion || '',
    metodoNotificacion: (initialData?.metodoNotificacion || 'SISTEMA') as MetodoNotificacion,
    correoDestino: initialData?.correoDestino || '',
    observaciones: initialData?.observaciones || '',
  });

  const [proyectos, setProyectos] = useState<{ value: number; label: string }[]>([]);
  const [tareas, setTareas] = useState<{ value: number; label: string }[]>([]);
  const [materiales, setMateriales] = useState<{ value: number; label: string }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [projs, tasksFina, tasksBruta, mats] = await Promise.all([
          proyectosService.listarProyectos(),
          tareasObraFinaService.listarTareasObraFina(),
          tareasObraBrutaService.listarTareasObraBruta(),
          materialesService.listarMateriales(),
        ]);

        setProyectos(projs.map(p => ({ value: p.idProyecto, label: p.nombre })));
        setTareas([
          ...tasksFina.map(t => ({ value: t.idTarea, label: `(Fina) ${t.nombre}` })),
          ...tasksBruta.map(t => ({ value: t.idTarea, label: `(Bruta) ${t.nombre}` })),
        ]);
        setMateriales(mats.map(m => ({ value: m.idMaterial, label: m.nombre })));
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'idProyecto' || name === 'idTarea' || name === 'idMaterial') 
        ? (value ? Number(value) : undefined) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.idProyecto && !formData.idTarea && !formData.idMaterial) {
      alert('Debe seleccionar al menos un destino: proyecto, tarea o material.');
      return;
    }
    onSubmit(formData);
  };

  if (loadingOptions) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="alerta-form">
      <div className="form-grid">
        <Select
          label="Tipo de Alerta"
          name="tipoAlerta"
          value={formData.tipoAlerta}
          onChange={handleChange}
          options={[
            { value: 'MATERIAL_BAJO', label: 'Material Bajo' },
            { value: 'RETRASO_TAREA', label: 'Retraso de Tarea' },
            { value: 'CRONOGRAMA_REPLANIFICADO', label: 'Cronograma Replanificado' },
            { value: 'CONTRATO_VENCIDO', label: 'Contrato Vencido' },
            { value: 'PRONOSTICO_STOCK', label: 'Pronóstico de Stock' },
          ]}
          required
        />
        <Select
          label="Proyecto (Opcional)"
          name="idProyecto"
          value={formData.idProyecto || ''}
          onChange={handleChange}
          options={[{ value: '', label: 'Seleccionar Proyecto' }, ...proyectos]}
        />
        <Select
          label="Tarea (Opcional)"
          name="idTarea"
          value={formData.idTarea || ''}
          onChange={handleChange}
          options={[{ value: '', label: 'Seleccionar Tarea' }, ...tareas]}
        />
        <Select
          label="Material (Opcional)"
          name="idMaterial"
          value={formData.idMaterial || ''}
          onChange={handleChange}
          options={[{ value: '', label: 'Seleccionar Material' }, ...materiales]}
        />
        <Select
          label="Método de Notificación"
          name="metodoNotificacion"
          value={formData.metodoNotificacion}
          onChange={handleChange}
          options={[
            { value: 'SISTEMA', label: 'Sistema' },
            { value: 'EMAIL', label: 'Email' },
          ]}
        />
        {formData.metodoNotificacion === 'EMAIL' && (
          <Input
            label="Correo Destino"
            name="correoDestino"
            type="email"
            value={formData.correoDestino}
            onChange={handleChange}
            placeholder="ejemplo@correo.com"
          />
        )}
      </div>

      <div className="form-full">
        <Input
          label="Mensaje de Notificación"
          name="mensajeNotificacion"
          value={formData.mensajeNotificacion}
          onChange={handleChange}
          placeholder="Ej: El stock del cemento está por debajo del 10%."
        />
      </div>

      <div className="form-full">
        <label className="input-label">Observaciones</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          className="form-textarea"
          rows={3}
        />
      </div>

      <div className="form-actions">
        <Button variant="ghost" onClick={onCancel} type="button">Cancelar</Button>
        <Button variant="primary" type="submit" loading={loading}>Guardar Configuración</Button>
      </div>
    </form>
  );
}
