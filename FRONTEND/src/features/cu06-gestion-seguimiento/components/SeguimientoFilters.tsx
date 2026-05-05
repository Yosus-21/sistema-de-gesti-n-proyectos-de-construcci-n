import { useState, useEffect, type FormEvent } from 'react';
import { Select, Button } from '../../../shared/components';
import { tareasObraFinaService } from '../../cu03-gestion-tareas-obra-fina/services/tareas-obra-fina.service';
import { tareasObraBrutaService } from '../../cu04-gestion-tareas-obra-bruta/services/tareas-obra-bruta.service';

interface SeguimientoFiltersProps {
  onBuscar: (idTarea?: number) => void;
  onLimpiar: () => void;
}

export function SeguimientoFilters({ onBuscar, onLimpiar }: SeguimientoFiltersProps) {
  const [idTarea, setIdTarea] = useState('');
  const [tareas, setTareas] = useState<{ label: string; value: number }[]>([]);
  const [loadingTareas, setLoadingTareas] = useState(false);

  useEffect(() => {
    const fetchTareas = async () => {
      setLoadingTareas(true);
      try {
        const [fina, bruta] = await Promise.all([
          tareasObraFinaService.listarTareasObraFina(),
          tareasObraBrutaService.listarTareasObraBruta(),
        ]);

        const unified = [
          ...fina.map(t => ({ label: `[Obra Fina] ${t.nombre}`, value: t.idTarea })),
          ...bruta.map(t => ({ label: `[Obra Bruta] ${t.nombre}`, value: t.idTarea })),
        ];
        setTareas(unified);
      } catch (err) {
        console.error('Error cargando tareas para filtros:', err);
      } finally {
        setLoadingTareas(false);
      }
    };

    fetchTareas();
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onBuscar(idTarea ? Number(idTarea) : undefined);
  };

  const handleLimpiar = () => {
    setIdTarea('');
    onLimpiar();
  };

  return (
    <form className="filters-container" onSubmit={handleSubmit}>
      <Select
        label="Tarea"
        value={idTarea}
        onChange={(e) => setIdTarea(e.target.value)}
        options={tareas}
        placeholder={loadingTareas ? "Cargando tareas..." : "Todas las tareas"}
        className="filter-field"
      />
      <div className="filter-actions" style={{ alignSelf: 'flex-end', marginBottom: '4px' }}>
        <Button type="submit" variant="primary">
          Buscar
        </Button>
        <Button type="button" variant="ghost" onClick={handleLimpiar}>
          Limpiar
        </Button>
      </div>
    </form>
  );
}
