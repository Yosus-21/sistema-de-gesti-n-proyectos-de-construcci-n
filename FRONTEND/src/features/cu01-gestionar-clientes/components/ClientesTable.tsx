import { useNavigate } from 'react-router-dom';
import { Table, Badge, Button, Can } from '../../../shared/components';
import { Role } from '../../../shared/types/roles.types';
import type { Column } from '../../../shared/components';
import type { Cliente } from '../types/cliente.types';

interface ClientesTableProps {
  clientes: Cliente[];
  loading: boolean;
  onEliminar: (cliente: Cliente) => void;
}

export function ClientesTable({ clientes, loading, onEliminar }: ClientesTableProps) {
  const navigate = useNavigate();

  const writeRoles = [Role.ADMIN, Role.GESTOR_PROYECTO];

  const columns: Column<Cliente>[] = [
    { key: 'nombre', header: 'Nombre' },
    {
      key: 'correo',
      header: 'Correo',
      render: (c) => c.correo ?? <span className="text-muted">—</span>,
    },
    {
      key: 'telefono',
      header: 'Teléfono',
      render: (c) => c.telefono ?? <span className="text-muted">—</span>,
    },
    {
      key: 'tipoCliente',
      header: 'Tipo',
      render: (c) =>
        c.tipoCliente ? (
          <Badge variant="info">{c.tipoCliente}</Badge>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    {
      key: 'activo',
      header: 'Estado',
      render: (c) =>
        c.activo !== false ? (
          <Badge variant="success">Activo</Badge>
        ) : (
          <Badge variant="neutral">Inactivo</Badge>
        ),
    },
  ];

  return (
    <Table<Cliente>
      columns={columns}
      data={clientes}
      getRowKey={(c) => c.idCliente}
      loading={loading}
      emptyMessage="No se encontraron clientes"
      actions={(cliente) => (
        <div className="row-actions">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(`/clientes/${cliente.idCliente}`)}
          >
            Ver
          </Button>
          <Can roles={writeRoles}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/clientes/${cliente.idCliente}/editar`)}
            >
              Editar
            </Button>
          </Can>
          <Can roles={writeRoles}>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onEliminar(cliente)}
            >
              Eliminar
            </Button>
          </Can>
        </div>
      )}
    />
  );
}
