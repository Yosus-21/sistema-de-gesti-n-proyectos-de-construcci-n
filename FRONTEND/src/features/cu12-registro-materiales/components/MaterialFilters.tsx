import { useState } from 'react';
import { Card, Input, Select, Button } from '../../../shared/components';
import type { ListarMaterialesParams, TipoMaterial } from '../types/material.types';

interface MaterialFiltersProps {
  onSearch: (params: ListarMaterialesParams) => void;
  onClear: () => void;
}

const TIPOS_MATERIAL: { value: TipoMaterial; label: string }[] = [
  { value: 'CEMENTO', label: 'Cemento' },
  { value: 'ARENA', label: 'Arena' },
  { value: 'GRAVA', label: 'Grava' },
  { value: 'LADRILLO', label: 'Ladrillo' },
  { value: 'ACERO', label: 'Acero' },
  { value: 'MADERA', label: 'Madera' },
  { value: 'VIDRIO', label: 'Vidrio' },
  { value: 'PINTURA', label: 'Pintura' },
  { value: 'HERRAMIENTA', label: 'Herramienta' },
  { value: 'OTRO', label: 'Otro' },
];

export function MaterialFilters({ onSearch, onClear }: MaterialFiltersProps) {
  const [filters, setFilters] = useState<ListarMaterialesParams>({
    busqueda: '',
    tipoMaterial: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    const emptyFilters = { busqueda: '', tipoMaterial: undefined };
    setFilters(emptyFilters);
    onClear();
  };

  return (
    <Card className="filters-card">
      <div className="filters-grid">
        <Input
          label="Buscar material"
          name="busqueda"
          placeholder="Nombre o descripción..."
          value={filters.busqueda}
          onChange={handleChange}
        />
        <Select
          label="Filtrar por tipo"
          name="tipoMaterial"
          value={filters.tipoMaterial || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Todos los tipos' },
            ...TIPOS_MATERIAL
          ]}
        />
        <div className="filter-actions">
          <Button variant="primary" onClick={handleSearch}>Buscar</Button>
          <Button variant="ghost" onClick={handleClear}>Limpiar</Button>
        </div>
      </div>
    </Card>
  );
}
