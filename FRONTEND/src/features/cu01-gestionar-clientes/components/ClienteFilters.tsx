import { useState, type FormEvent } from 'react';
import { Input, Button } from '../../../shared/components';

interface ClienteFiltersProps {
  onBuscar: (busqueda: string) => void;
  onLimpiar: () => void;
}

export function ClienteFilters({ onBuscar, onLimpiar }: ClienteFiltersProps) {
  const [busqueda, setBusqueda] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onBuscar(busqueda.trim());
  };

  const handleLimpiar = () => {
    setBusqueda('');
    onLimpiar();
  };

  return (
    <form className="cliente-filters" onSubmit={handleSubmit}>
      <Input
        placeholder="Buscar por nombre, correo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="filter-input"
      />
      <div className="filter-actions">
        <Button type="submit" variant="primary" size="md">
          Buscar
        </Button>
        <Button type="button" variant="ghost" size="md" onClick={handleLimpiar}>
          Limpiar
        </Button>
      </div>
    </form>
  );
}
