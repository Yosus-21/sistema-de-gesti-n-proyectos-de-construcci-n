import { useState, useEffect } from 'react';
import { Card, Select, Button, Loader } from '../../../shared/components';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import { materialesService } from '../../cu12-registro-materiales/services/materiales.service';
import type { ListarPronosticosMaterialIaParams } from '../types/pronostico-material-ia.types';

interface PronosticoMaterialIaFiltersProps {
  onSearch: (params: ListarPronosticosMaterialIaParams) => void;
  onClear: () => void;
}

export function PronosticoMaterialIaFilters({ onSearch, onClear }: PronosticoMaterialIaFiltersProps) {
  const [params, setParams] = useState<ListarPronosticosMaterialIaParams>({
    idProyecto: undefined,
    idMaterial: undefined,
  });

  const [proyectos, setProyectos] = useState<{ value: number; label: string }[]>([]);
  const [materiales, setMateriales] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projs, mats] = await Promise.all([
          proyectosService.listarProyectos(),
          materialesService.listarMateriales()
        ]);
        setProyectos(projs.map(p => ({ value: p.idProyecto, label: p.nombre })));
        setMateriales(mats.map(m => ({ value: m.idMaterial, label: m.nombre })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: value === '' ? undefined : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(params);
  };

  const handleClear = () => {
    setParams({ idProyecto: undefined, idMaterial: undefined });
    onClear();
  };

  if (loading) return <Loader />;

  return (
    <Card className="filters-card">
      <form onSubmit={handleSubmit} className="filters-form">
        <div className="form-grid">
          <Select
            label="Filtrar por Proyecto"
            name="idProyecto"
            value={params.idProyecto || ''}
            onChange={handleChange}
            options={[
              { value: '', label: 'Todos los proyectos' },
              ...proyectos
            ]}
          />
          <Select
            label="Filtrar por Material"
            name="idMaterial"
            value={params.idMaterial || ''}
            onChange={handleChange}
            options={[
              { value: '', label: 'Todos los materiales' },
              ...materiales
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
