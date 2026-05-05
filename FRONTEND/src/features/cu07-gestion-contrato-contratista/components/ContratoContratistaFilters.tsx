import { useState, useEffect } from 'react';
import { Card, Select, Input, Button } from '../../../shared/components';
import { proyectosService } from '../../cu02-creacion-proyectos/services/proyectos.service';
import type { ListarContratosContratistaParams } from '../types/contrato-contratista.types';

interface ContratoContratistaFiltersProps {
  onSearch: (params: ListarContratosContratistaParams) => void;
  onClear: () => void;
}

export function ContratoContratistaFilters({ onSearch, onClear }: ContratoContratistaFiltersProps) {
  const [params, setParams] = useState<ListarContratosContratistaParams>({
    idProyecto: undefined,
    idContratista: undefined
  });

  const [proyectos, setProyectos] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    let cancelled = false;
    proyectosService.listarProyectos()
      .then(data => {
        if (!cancelled) {
          setProyectos(data.map(p => ({ label: p.nombre, value: p.idProyecto })));
        }
      })
      .catch(console.error);
    return () => { cancelled = true; };
  }, []);

  const handleSearch = () => {
    onSearch(params);
  };

  const handleClear = () => {
    setParams({ idProyecto: undefined, idContratista: undefined });
    onClear();
  };

  return (
    <Card className="filters-card">
      <div className="filters-grid">
        <Select
          label="Proyecto"
          value={params.idProyecto?.toString() || ''}
          onChange={(e) => setParams({ ...params, idProyecto: e.target.value ? Number(e.target.value) : undefined })}
          options={proyectos}
          placeholder="Todos los proyectos"
        />
        <Input
          label="ID Contratista"
          type="number"
          value={params.idContratista?.toString() || ''}
          onChange={(e) => setParams({ ...params, idContratista: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="Todos los contratistas"
        />
        <div className="filter-actions">
          <Button variant="ghost" onClick={handleClear}>Limpiar</Button>
          <Button variant="primary" onClick={handleSearch}>Buscar</Button>
        </div>
      </div>
    </Card>
  );
}
