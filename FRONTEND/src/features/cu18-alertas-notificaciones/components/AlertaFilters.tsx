import { useState, useEffect } from 'react';
import { Card, Select, Button, Loader } from '../../../shared/components';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import { tareasObraFinaService } from '../../cu03-gestion-tareas-obra-fina/services/tareas-obra-fina.service';
import { tareasObraBrutaService } from '../../cu04-gestion-tareas-obra-bruta/services/tareas-obra-bruta.service';
import { materialesService } from '../../cu12-registro-materiales/services/materiales.service';
import type { ListarAlertasParams } from '../types/alerta-notificacion.types';

interface AlertaFiltersProps {
  onSearch: (params: ListarAlertasParams) => void;
  onClear: () => void;
}

export function AlertaFilters({ onSearch, onClear }: AlertaFiltersProps) {
  const [params, setParams] = useState<ListarAlertasParams>({
    idProyecto: undefined,
    idTarea: undefined,
    idMaterial: undefined,
    tipoAlerta: undefined,
    estadoAlerta: undefined,
  });

  const [proyectos, setProyectos] = useState<{ value: number; label: string }[]>([]);
  const [tareas, setTareas] = useState<{ value: number; label: string }[]>([]);
  const [materiales, setMateriales] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (name.startsWith('id') ? Number(value) : value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(params);
  };

  const handleClear = () => {
    setParams({
      idProyecto: undefined,
      idTarea: undefined,
      idMaterial: undefined,
      tipoAlerta: undefined,
      estadoAlerta: undefined,
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
            label="Tarea"
            name="idTarea"
            value={params.idTarea || ''}
            onChange={handleChange}
            options={[{ value: '', label: 'Todas' }, ...tareas]}
          />
          <Select
            label="Material"
            name="idMaterial"
            value={params.idMaterial || ''}
            onChange={handleChange}
            options={[{ value: '', label: 'Todos' }, ...materiales]}
          />
          <Select
            label="Tipo"
            name="tipoAlerta"
            value={params.tipoAlerta || ''}
            onChange={handleChange}
            options={[
              { value: '', label: 'Todos' },
              { value: 'MATERIAL_BAJO', label: 'Material Bajo' },
              { value: 'RETRASO_TAREA', label: 'Retraso de Tarea' },
              { value: 'CRONOGRAMA_REPLANIFICADO', label: 'Cronograma Replanificado' },
              { value: 'CONTRATO_VENCIDO', label: 'Contrato Vencido' },
              { value: 'PRONOSTICO_STOCK', label: 'Pronóstico de Stock' },
            ]}
          />
          <Select
            label="Estado"
            name="estadoAlerta"
            value={params.estadoAlerta || ''}
            onChange={handleChange}
            options={[
              { value: '', label: 'Todos' },
              { value: 'ACTIVA', label: 'Activa' },
              { value: 'INACTIVA', label: 'Inactiva' },
              { value: 'NOTIFICADA', label: 'Notificada' },
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
