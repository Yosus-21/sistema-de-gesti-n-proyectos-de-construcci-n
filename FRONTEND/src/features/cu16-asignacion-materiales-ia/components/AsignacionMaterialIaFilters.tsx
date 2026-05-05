import { useState, useEffect } from 'react';
import { Card, Select, Button, Loader } from '../../../shared/components';
import { tareasObraFinaService } from '../../cu03-gestion-tareas-obra-fina/services/tareas-obra-fina.service';
import { tareasObraBrutaService } from '../../cu04-gestion-tareas-obra-bruta/services/tareas-obra-bruta.service';
import type { ListarAsignacionesMaterialIaParams } from '../types/asignacion-material-ia.types';

interface AsignacionMaterialIaFiltersProps {
  onSearch: (params: ListarAsignacionesMaterialIaParams) => void;
  onClear: () => void;
}

export function AsignacionMaterialIaFilters({ onSearch, onClear }: AsignacionMaterialIaFiltersProps) {
  const [params, setParams] = useState<ListarAsignacionesMaterialIaParams>({
    idTarea: undefined,
  });

  const [tareas, setTareas] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksFina, tasksBruta] = await Promise.all([
          tareasObraFinaService.listarTareasObraFina(),
          tareasObraBrutaService.listarTareasObraBruta()
        ]);
        
        const allTasks = [
          ...tasksFina.map(t => ({ value: t.idTarea, label: `(Fina) ${t.nombre}` })),
          ...tasksBruta.map(t => ({ value: t.idTarea, label: `(Bruta) ${t.nombre}` }))
        ];
        setTareas(allTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
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
    setParams({ idTarea: undefined });
    onClear();
  };

  if (loading) return <Loader />;

  return (
    <Card className="filters-card">
      <form onSubmit={handleSubmit} className="filters-form">
        <Select
          label="Filtrar por Tarea"
          name="idTarea"
          value={params.idTarea || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Todas las tareas' },
            ...tareas
          ]}
        />
        <div className="filters-actions">
          <Button variant="ghost" type="button" onClick={handleClear}>Limpiar</Button>
          <Button variant="primary" type="submit">Buscar</Button>
        </div>
      </form>
    </Card>
  );
}
