import { useState, useEffect, type FormEvent } from 'react';
import { Input, Select, Button } from '../../../shared/components';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import type { Proyecto } from '../../cu02-creacion-proyectos/types/proyecto.types';

interface TareaObraBrutaFiltersProps {
  onBuscar: (busqueda: string, idProyecto?: number) => void;
  onLimpiar: () => void;
}

export function TareaObraBrutaFilters({ onBuscar, onLimpiar }: TareaObraBrutaFiltersProps) {
  const [busqueda, setBusqueda] = useState('');
  const [idProyecto, setIdProyecto] = useState('');
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  useEffect(() => {
    proyectosService.listarProyectos().then(setProyectos).catch(console.error);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onBuscar(busqueda, idProyecto ? Number(idProyecto) : undefined);
  };

  const handleLimpiar = () => {
    setBusqueda('');
    setIdProyecto('');
    onLimpiar();
  };

  return (
    <form className="filters-container" onSubmit={handleSubmit}>
      <Input
        placeholder="Buscar tarea..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="filter-field"
      />
      <Select
        value={idProyecto}
        onChange={(e) => setIdProyecto(e.target.value)}
        options={proyectos.map(p => ({ label: p.nombre, value: p.idProyecto }))}
        placeholder="Todos los proyectos"
        className="filter-field"
      />
      <div className="filter-actions">
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
