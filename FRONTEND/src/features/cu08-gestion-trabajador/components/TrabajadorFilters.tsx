import { useState, type FormEvent } from 'react';
import { Input, Select, Button } from '../../../shared/components';
import { OcupacionTrabajador } from '../types/trabajador.types';

interface TrabajadorFiltersProps {
  onBuscar: (busqueda: string, ocupacion?: OcupacionTrabajador) => void;
  onLimpiar: () => void;
}

const OCUPACION_OPTIONS = [
  { label: 'Albañil', value: OcupacionTrabajador.ALBANIL },
  { label: 'Plomero', value: OcupacionTrabajador.PLOMERO },
  { label: 'Electricista', value: OcupacionTrabajador.ELECTRICISTA },
  { label: 'Vidriero', value: OcupacionTrabajador.VIDRIERO },
  { label: 'Carpintero', value: OcupacionTrabajador.CARPINTERO },
];

export function TrabajadorFilters({ onBuscar, onLimpiar }: TrabajadorFiltersProps) {
  const [busqueda, setBusqueda] = useState('');
  const [ocupacion, setOcupacion] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onBuscar(busqueda.trim(), ocupacion as OcupacionTrabajador || undefined);
  };

  const handleLimpiar = () => {
    setBusqueda('');
    setOcupacion('');
    onLimpiar();
  };

  return (
    <form className="trabajador-filters" onSubmit={handleSubmit}>
      <Input
        placeholder="Buscar por nombre, CI o correo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="filter-input"
      />
      <Select
        value={ocupacion}
        onChange={(e) => setOcupacion(e.target.value)}
        options={OCUPACION_OPTIONS}
        placeholder="Todas las ocupaciones"
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
