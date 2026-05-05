import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Card, Input, Select, Button } from '../../../shared/components';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import { cronogramasService } from '../../cu05-creacion-cronograma/services/cronogramas.service';
import type { Proyecto } from '../../cu02-creacion-proyectos/types/proyecto.types';
import type { Cronograma } from '../../cu05-creacion-cronograma/types/cronograma.types';
import type { 
  TareaObraBruta, 
  RegistrarTareaObraBrutaDto, 
  ModificarTareaObraBrutaDto,
  PrioridadTarea,
  PerfilObraBruta,
  EstadoTarea
} from '../types/tarea-obra-bruta.types';

interface TareaObraBrutaFormProps {
  initialData?: TareaObraBruta;
  onSubmit: (data: RegistrarTareaObraBrutaDto | ModificarTareaObraBrutaDto) => void;
  loading?: boolean;
  isEdit?: boolean;
}

export function TareaObraBrutaForm({ initialData, onSubmit, loading, isEdit }: TareaObraBrutaFormProps) {
  const [values, setValues] = useState({
    idProyecto: initialData?.idProyecto?.toString() || '',
    idCronograma: initialData?.idCronograma?.toString() || '',
    nombre: initialData?.nombre || '',
    descripcion: initialData?.descripcion || '',
    fechaInicioPlanificada: initialData?.fechaInicioPlanificada?.split('T')[0] || '',
    fechaFinPlanificada: initialData?.fechaFinPlanificada?.split('T')[0] || '',
    prioridadTarea: initialData?.prioridadTarea || 'MEDIA',
    perfilRequerido: initialData?.perfilRequerido || 'ALBANIL',
    estadoTarea: initialData?.estadoTarea || 'PENDIENTE',
  });

  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [cronogramas, setCronogramas] = useState<Cronograma[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    proyectosService.listarProyectos().then(setProyectos).catch(console.error);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Reset cronogramas if project changes
    if (name === 'idProyecto') {
      setValues(prev => ({ ...prev, idCronograma: '' }));
      setCronogramas([]);
    }

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  useEffect(() => {
    if (!values.idProyecto) return;
    
    let cancelled = false;
    cronogramasService.listarCronogramas({ idProyecto: Number(values.idProyecto) })
      .then(res => {
        if (!cancelled) setCronogramas(res);
      })
      .catch(console.error);
      
    return () => { cancelled = true; };
  }, [values.idProyecto]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!values.idProyecto) errors.idProyecto = 'El proyecto es obligatorio';
    if (!values.nombre.trim()) errors.nombre = 'El nombre es obligatorio';
    if (!values.fechaInicioPlanificada) errors.fechaInicioPlanificada = 'La fecha de inicio es obligatoria';
    if (!values.fechaFinPlanificada) errors.fechaFinPlanificada = 'La fecha de fin es obligatoria';
    
    if (values.fechaInicioPlanificada && values.fechaFinPlanificada) {
      if (new Date(values.fechaFinPlanificada) < new Date(values.fechaInicioPlanificada)) {
        errors.fechaFinPlanificada = 'La fecha de fin no puede ser anterior a la de inicio';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit) {
      const dto: ModificarTareaObraBrutaDto = {
        nombre: values.nombre,
        descripcion: values.descripcion,
        fechaInicioPlanificada: values.fechaInicioPlanificada,
        fechaFinPlanificada: values.fechaFinPlanificada,
        prioridadTarea: values.prioridadTarea as PrioridadTarea,
        perfilRequerido: values.perfilRequerido as PerfilObraBruta,
        estadoTarea: values.estadoTarea as EstadoTarea,
      };
      onSubmit(dto);
    } else {
      const dto: RegistrarTareaObraBrutaDto = {
        idProyecto: Number(values.idProyecto),
        idCronograma: values.idCronograma ? Number(values.idCronograma) : undefined,
        nombre: values.nombre,
        descripcion: values.descripcion,
        fechaInicioPlanificada: values.fechaInicioPlanificada,
        fechaFinPlanificada: values.fechaFinPlanificada,
        prioridadTarea: values.prioridadTarea as PrioridadTarea,
        perfilRequerido: values.perfilRequerido as PerfilObraBruta,
      };
      onSubmit(dto);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="tarea-form">
        <div className="form-grid">
          {!isEdit && (
            <Select
              label="Proyecto *"
              name="idProyecto"
              value={values.idProyecto}
              onChange={handleChange}
              options={proyectos.map(p => ({ label: p.nombre, value: p.idProyecto }))}
              error={fieldErrors.idProyecto}
              required
            />
          )}

          {!isEdit && (
            <Select
              label="Cronograma"
              name="idCronograma"
              value={values.idCronograma}
              onChange={handleChange}
              options={cronogramas.map(c => ({ label: `Cronograma #${c.idCronograma}`, value: c.idCronograma }))}
              placeholder="Seleccione un proyecto primero"
              disabled={!values.idProyecto}
            />
          )}

          <Input
            label="Nombre de Tarea *"
            name="nombre"
            value={values.nombre}
            onChange={handleChange}
            error={fieldErrors.nombre}
            required
          />

          <Select
            label="Prioridad"
            name="prioridadTarea"
            value={values.prioridadTarea}
            onChange={handleChange}
            options={[
              { label: 'Baja', value: 'BAJA' },
              { label: 'Media', value: 'MEDIA' },
              { label: 'Alta', value: 'ALTA' },
            ]}
          />

          <Select
            label="Perfil Requerido *"
            name="perfilRequerido"
            value={values.perfilRequerido}
            onChange={handleChange}
            options={[
              { label: 'Albañil', value: 'ALBANIL' },
              { label: 'Plomero', value: 'PLOMERO' },
              { label: 'Electricista', value: 'ELECTRICISTA' },
            ]}
          />

          {isEdit && (
            <Select
              label="Estado"
              name="estadoTarea"
              value={values.estadoTarea}
              onChange={handleChange}
              options={[
                { label: 'Pendiente', value: 'PENDIENTE' },
                { label: 'En Progreso', value: 'EN_PROGRESO' },
                { label: 'Finalizada', value: 'FINALIZADA' },
                { label: 'Cancelada', value: 'CANCELADA' },
              ]}
            />
          )}

          <Input
            label="Fecha Inicio Planificada *"
            name="fechaInicioPlanificada"
            type="date"
            value={values.fechaInicioPlanificada}
            onChange={handleChange}
            error={fieldErrors.fechaInicioPlanificada}
            required
          />

          <Input
            label="Fecha Fin Planificada *"
            name="fechaFinPlanificada"
            type="date"
            value={values.fechaFinPlanificada}
            onChange={handleChange}
            error={fieldErrors.fechaFinPlanificada}
            required
          />
        </div>

        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label className="input-label">Descripción</label>
          <textarea
            name="descripcion"
            className="input-field"
            rows={3}
            value={values.descripcion}
            onChange={handleChange}
            placeholder="Detalles de la tarea..."
          />
        </div>

        <div className="form-actions" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button type="submit" loading={loading}>
            {isEdit ? 'Actualizar Tarea' : 'Registrar Tarea'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
