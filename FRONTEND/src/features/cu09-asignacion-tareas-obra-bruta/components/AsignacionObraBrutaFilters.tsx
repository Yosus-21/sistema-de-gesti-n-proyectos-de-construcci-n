import { useState, useEffect, type FormEvent } from 'react';
import { Select, Button } from '../../../shared/components';
import { tareasObraBrutaService } from '../../cu04-gestion-tareas-obra-bruta/services/tareas-obra-bruta.service';
import { trabajadoresService } from '../../cu08-gestion-trabajador/services/trabajadores.service';

interface AsignacionObraBrutaFiltersProps {
  onBuscar: (params: { idTarea?: number; idTrabajador?: number }) => void;
  onLimpiar: () => void;
}

export function AsignacionObraBrutaFilters({ onBuscar, onLimpiar }: AsignacionObraBrutaFiltersProps) {
  const [idTarea, setIdTarea] = useState('');
  const [idTrabajador, setIdTrabajador] = useState('');
  
  const [tareas, setTareas] = useState<{ label: string; value: number }[]>([]);
  const [trabajadores, setTrabajadores] = useState<{ label: string; value: number }[]>([]);
  
  const [loading, setLoading] = useState(true);

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
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onBuscar({ 
      idTarea: idTarea ? Number(idTarea) : undefined, 
      idTrabajador: idTrabajador ? Number(idTrabajador) : undefined 
    });
  };

  const handleLimpiar = () => {
    setIdTarea('');
    setIdTrabajador('');
    onLimpiar();
  };

  return (
    <form className="filters-container" onSubmit={handleSubmit}>
      <Select
        label="Tarea"
        value={idTarea}
        onChange={(e) => setIdTarea(e.target.value)}
        options={tareas}
        placeholder="Todas las tareas"
        className="filter-field"
      />
      <Select
        label="Trabajador"
        value={idTrabajador}
        onChange={(e) => setIdTrabajador(e.target.value)}
        options={trabajadores}
        placeholder="Todos los trabajadores"
        className="filter-field"
      />
      <div className="filter-actions">
        <Button type="submit" variant="primary" loading={loading}>
          Buscar
        </Button>
        <Button type="button" variant="ghost" onClick={handleLimpiar}>
          Limpiar
        </Button>
      </div>
    </form>
  );
}
