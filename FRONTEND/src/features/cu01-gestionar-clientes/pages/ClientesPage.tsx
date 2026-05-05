import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, EmptyState, ConfirmDialog, Loader, Can } from '../../../shared/components';
import { Role } from '../../../shared/types/roles.types';
import { ClienteFilters } from '../components/ClienteFilters';
import { ClientesTable } from '../components/ClientesTable';
import { useClientes } from '../hooks/useClientes';
import { useEliminarCliente } from '../hooks/useEliminarCliente';
import type { Cliente } from '../types/cliente.types';
import '../styles/clientes.css';

export function ClientesPage() {
  const navigate = useNavigate();
  const { clientes, loading, error, refetch, setFiltros } = useClientes();
  const { eliminarCliente, loading: deletingLoading } = useEliminarCliente();
  const [clienteAEliminar, setClienteAEliminar] = useState<Cliente | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleBuscar = (busqueda: string) => {
    setFiltros((prev) => ({ ...prev, busqueda }));
  };

  const handleLimpiar = () => {
    setFiltros({});
  };

  const handleConfirmEliminar = async () => {
    if (!clienteAEliminar) return;
    try {
      setDeleteError(null);
      await eliminarCliente(clienteAEliminar.idCliente);
      setClienteAEliminar(null);
      refetch();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Error al eliminar');
    }
  };

  const writeRoles = [Role.ADMIN, Role.GESTOR_PROYECTO];

  return (
    <div>
      <div className="page-header">
        <h1>Clientes</h1>
        <Can roles={writeRoles}>
          <Button onClick={() => navigate('/clientes/nuevo')}>+ Nuevo cliente</Button>
        </Can>
      </div>

      <ClienteFilters onBuscar={handleBuscar} onLimpiar={handleLimpiar} />

      {error && (
        <div className="feedback-banner error">{error}</div>
      )}
      {deleteError && (
        <div className="feedback-banner error">{deleteError}</div>
      )}

      {loading ? (
        <Loader text="Cargando clientes..." />
      ) : clientes.length === 0 && !error ? (
        <EmptyState
          title="Sin clientes registrados"
          description="Registra el primer cliente para comenzar."
          action={
            <Can roles={writeRoles}>
              <Button onClick={() => navigate('/clientes/nuevo')}>
                Registrar cliente
              </Button>
            </Can>
          }
        />
      ) : (
        <ClientesTable
          clientes={clientes}
          loading={loading}
          onEliminar={(c) => setClienteAEliminar(c)}
        />
      )}

      <ConfirmDialog
        open={clienteAEliminar !== null}
        title="Eliminar cliente"
        message={`¿Estás seguro de eliminar a "${clienteAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        loading={deletingLoading}
        onConfirm={handleConfirmEliminar}
        onCancel={() => setClienteAEliminar(null)}
      />
    </div>
  );
}
