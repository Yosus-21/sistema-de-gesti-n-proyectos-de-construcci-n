import { useState, useEffect } from 'react';
import { Button, Input, Select, Loader } from '../../../shared/components';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import type { GenerarReporteDto } from '../types/reporte.types';

interface ReporteFormProps {
  onSubmit: (data: GenerarReporteDto) => void;
  loading?: boolean;
  onCancel: () => void;
}

export function ReporteForm({ onSubmit, loading, onCancel }: ReporteFormProps) {
  const [formData, setFormData] = useState<GenerarReporteDto>({
    tipoReporte: 'GENERAL',
    idProyecto: undefined,
    fechaInicioPeriodo: '',
    fechaFinPeriodo: '',
  });

  const [proyectos, setProyectos] = useState<{ value: number; label: string }[]>([]);
  const [loadingProyectos, setLoadingProyectos] = useState(true);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await proyectosService.listarProyectos();
        setProyectos(data.map(p => ({ value: p.idProyecto, label: p.nombre })));
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoadingProyectos(false);
      }
    };
    fetchProyectos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'idProyecto' ? (value ? Number(value) : undefined) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fechaInicioPeriodo && formData.fechaFinPeriodo) {
      if (new Date(formData.fechaFinPeriodo) < new Date(formData.fechaInicioPeriodo)) {
        alert('La fecha de fin no puede ser anterior a la fecha de inicio.');
        return;
      }
    }
    onSubmit(formData);
  };

  if (loadingProyectos) return <Loader />;

  return (
    <form onSubmit={handleSubmit} className="reporte-form">
      <div className="form-grid">
        <Select
          label="Proyecto (Opcional)"
          name="idProyecto"
          value={formData.idProyecto || ''}
          onChange={handleChange}
          options={[{ value: '', label: 'Todos los Proyectos' }, ...proyectos]}
        />
        <Select
          label="Tipo de Reporte"
          name="tipoReporte"
          value={formData.tipoReporte}
          onChange={handleChange}
          options={[
            { value: 'AVANCE_PROYECTO', label: 'Avance de Proyecto' },
            { value: 'MATERIALES', label: 'Materiales' },
            { value: 'COMPRAS', label: 'Compras' },
            { value: 'CONTRATOS', label: 'Contratos' },
            { value: 'GENERAL', label: 'General' },
          ]}
          required
        />
        <Input
          label="Fecha Inicio Período (Opcional)"
          name="fechaInicioPeriodo"
          type="date"
          value={formData.fechaInicioPeriodo}
          onChange={handleChange}
        />
        <Input
          label="Fecha Fin Período (Opcional)"
          name="fechaFinPeriodo"
          type="date"
          value={formData.fechaFinPeriodo}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <Button variant="ghost" onClick={onCancel} type="button">Cancelar</Button>
        <Button variant="primary" type="submit" loading={loading}>Generar Reporte</Button>
      </div>
    </form>
  );
}
