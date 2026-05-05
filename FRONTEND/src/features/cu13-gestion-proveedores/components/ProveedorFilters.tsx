import { useState } from 'react';
import { Card, Input, Button } from '../../../shared/components';
import type { ListarProveedoresParams } from '../types/proveedor.types';

interface ProveedorFiltersProps {
  onSearch: (params: ListarProveedoresParams) => void;
  onClear: () => void;
}

export function ProveedorFilters({ onSearch, onClear }: ProveedorFiltersProps) {
  const [filters, setFilters] = useState<ListarProveedoresParams>({
    busqueda: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({ busqueda: '' });
    onClear();
  };

  return (
    <Card className="filters-card">
      <div className="filters-grid">
        <Input
          label="Buscar proveedor"
          name="busqueda"
          placeholder="Nombre, NIT, correo..."
          value={filters.busqueda}
          onChange={handleChange}
        />
        <div className="filter-actions">
          <Button variant="primary" onClick={handleSearch}>Buscar</Button>
          <Button variant="ghost" onClick={handleClear}>Limpiar</Button>
        </div>
      </div>
    </Card>
  );
}
