import { useState, useEffect } from 'react';
import { Card, Select, Button, Loader } from '../../../shared/components';
import { ordenesCompraService } from '../../cu14-gestion-ordenes-compra/services/ordenes-compra.service';
import { materialesService } from '../../cu12-registro-materiales/services/materiales.service';
import type { ListarEntregasMaterialParams } from '../types/entrega-material.types';

interface EntregaMaterialFiltersProps {
  onSearch: (params: ListarEntregasMaterialParams) => void;
  onClear: () => void;
}

export function EntregaMaterialFilters({ onSearch, onClear }: EntregaMaterialFiltersProps) {
  const [filters, setFilters] = useState<ListarEntregasMaterialParams>({
    idOrdenCompra: undefined,
    idMaterial: undefined,
  });

  const [ordenes, setOrdenes] = useState<{ value: number; label: string }[]>([]);
  const [materiales, setMateriales] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      ordenesCompraService.listarOrdenesCompra(),
      materialesService.listarMateriales()
    ]).then(([ords, mats]) => {
      setOrdenes(ords.map(o => ({ value: o.idOrdenCompra, label: `Orden #${o.idOrdenCompra}` })));
      setMateriales(mats.map(m => ({ value: m.idMaterial, label: m.nombre })));
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : Number(value),
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({ idOrdenCompra: undefined, idMaterial: undefined });
    onClear();
  };

  if (loading) return <Loader />;

  return (
    <Card className="filters-card">
      <div className="filters-grid">
        <Select
          label="Orden de Compra"
          name="idOrdenCompra"
          value={filters.idOrdenCompra || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Todas las órdenes' },
            ...ordenes
          ]}
        />
        <Select
          label="Material"
          name="idMaterial"
          value={filters.idMaterial || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Todos los materiales' },
            ...materiales
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
