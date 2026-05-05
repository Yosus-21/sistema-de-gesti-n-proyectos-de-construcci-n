import { useState, useEffect } from 'react';
import { Card, Select, Button, Loader } from '../../../shared/components';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import type { ListarReportesParams } from '../types/reporte.types';

interface ReporteFiltersProps {
  onSearch: (params: ListarReportesParams) => void;
  onClear: () => void;
}

export function ReporteFilters({ onSearch, onClear }: ReporteFiltersProps) {
  const [params, setParams] = useState<ListarReportesParams>({
    idProyecto: undefined,
    tipoReporte: undefined,
  });

  const [proyectos, setProyectos] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await proyectosService.listarProyectos();
        setProyectos(data.map(p => ({ value: p.idProyecto, label: p.nombre })));
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProyectos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (name === 'idProyecto' ? Number(value) : value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(params);
  };

  const handleClear = () => {
    setParams({
      idProyecto: undefined,
      tipoReporte: undefined,
    });
    onClear();
  };

  if (loading) return <Loader />;

  return (
    <Card className="filters-card">
      <form onSubmit={handleSubmit} className="filters-form">
        <div className="form-grid">
          <Select
            label="Proyecto"
            name="idProyecto"
            value={params.idProyecto || ''}
            onChange={handleChange}
            options={[{ value: '', label: 'Todos' }, ...proyectos]}
          />
          <Select
            label="Tipo"
            name="tipoReporte"
            value={params.tipoReporte || ''}
            onChange={handleChange}
            options={[
              { value: '', label: 'Todos' },
              { value: 'AVANCE_PROYECTO', label: 'Avance de Proyecto' },
              { value: 'MATERIALES', label: 'Materiales' },
              { value: 'COMPRAS', label: 'Compras' },
              { value: 'CONTRATOS', label: 'Contratos' },
              { value: 'GENERAL', label: 'General' },
            ]}
          />
        </div>
        <div className="filters-actions">
          <Button variant="ghost" type="button" onClick={handleClear}>Limpiar</Button>
          <Button variant="primary" type="submit">Buscar</Button>
        </div>
      </form>
    </Card>
  );
}
