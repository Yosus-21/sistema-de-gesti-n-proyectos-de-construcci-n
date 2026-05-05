import { useState, useEffect } from 'react';
import { Card, Select, Button, Loader } from '../../../shared/components';
import { proveedoresService } from '../../cu13-gestion-proveedores/services/proveedores.service';
import type { ListarOrdenesCompraParams } from '../types/orden-compra.types';

interface OrdenCompraFiltersProps {
  onSearch: (params: ListarOrdenesCompraParams) => void;
  onClear: () => void;
}

export function OrdenCompraFilters({ onSearch, onClear }: OrdenCompraFiltersProps) {
  const [filters, setFilters] = useState<ListarOrdenesCompraParams>({
    idProveedor: undefined,
    estadoOrden: undefined,
  });

  const [proveedores, setProveedores] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    proveedoresService.listarProveedores()
      .then(data => {
        setProveedores(data.map(p => ({ value: p.idProveedor, label: p.nombre })));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (name === 'idProveedor' ? Number(value) : value),
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({ idProveedor: undefined, estadoOrden: undefined });
    onClear();
  };

  if (loading) return <Loader />;

  return (
    <Card className="filters-card">
      <div className="filters-grid">
        <Select
          label="Filtrar por Proveedor"
          name="idProveedor"
          value={filters.idProveedor || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Todos los proveedores' },
            ...proveedores
          ]}
        />
        <Select
          label="Filtrar por Estado"
          name="estadoOrden"
          value={filters.estadoOrden || ''}
          onChange={handleChange}
          options={[
            { value: '', label: 'Todos los estados' },
            { value: 'BORRADOR', label: 'Borrador' },
            { value: 'EMITIDA', label: 'Emitida' },
            { value: 'RECIBIDA', label: 'Recibida' },
            { value: 'CANCELADA', label: 'Cancelada' },
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
