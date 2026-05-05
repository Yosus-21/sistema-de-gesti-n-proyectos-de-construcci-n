import { useState, useEffect, type FormEvent } from 'react';
import { Input, Select, Button } from '../../../shared/components';
import { clientesService } from '../../cu01-gestionar-clientes/services/clientes.service';
import type { Cliente } from '../../cu01-gestionar-clientes/types/cliente.types';

interface ProyectoFiltersProps {
  onBuscar: (busqueda: string, idCliente?: number) => void;
  onLimpiar: () => void;
}

export function ProyectoFilters({ onBuscar, onLimpiar }: ProyectoFiltersProps) {
  const [busqueda, setBusqueda] = useState('');
  const [idCliente, setIdCliente] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    clientesService.listarClientes().then(setClientes).catch(() => {});
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onBuscar(busqueda.trim(), idCliente ? Number(idCliente) : undefined);
  };

  const handleLimpiar = () => {
    setBusqueda('');
    setIdCliente('');
    onLimpiar();
  };

  const clienteOptions = clientes.map(c => ({
    label: c.nombre,
    value: c.idCliente
  }));

  return (
    <form className="proyecto-filters" onSubmit={handleSubmit}>
      <Input
        placeholder="Nombre del proyecto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="filter-input"
      />
      <Select
        value={idCliente}
        onChange={(e) => setIdCliente(e.target.value)}
        options={clienteOptions}
        placeholder="Todos los clientes"
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
