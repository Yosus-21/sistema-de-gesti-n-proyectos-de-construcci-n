import { useState, useEffect, type FormEvent } from 'react';
import { Input, Select, Button } from '../../../shared/components';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import type { Proyecto } from '../../cu02-creacion-proyectos/types/proyecto.types';

interface CronogramaFiltersProps {
  onBuscar: (busqueda: string, idProyecto?: number) => void;
  onLimpiar: () => void;
}

export function CronogramaFilters({ onBuscar, onLimpiar }: CronogramaFiltersProps) {
  const [busqueda, setBusqueda] = useState('');
  const [idProyecto, setIdProyecto] = useState('');
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);

  useEffect(() => {
    proyectosService.listarProyectos().then(setProyectos).catch(() => {});
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onBuscar(busqueda.trim(), idProyecto ? Number(idProyecto) : undefined);
  };

  const handleLimpiar = () => {
    setBusqueda('');
    setIdProyecto('');
    onLimpiar();
  };

  const proyectoOptions = proyectos.map(p => ({
    label: p.nombre,
    value: p.idProyecto
  }));

  return (
    <form className="cronograma-filters" onSubmit={handleSubmit}>
      <Input
        placeholder="Buscar cronograma..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="filter-input"
      />
      <Select
        value={idProyecto}
        onChange={(e) => setIdProyecto(e.target.value)}
        options={proyectoOptions}
        placeholder="Todos los proyectos"
        className="filter-select"
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
