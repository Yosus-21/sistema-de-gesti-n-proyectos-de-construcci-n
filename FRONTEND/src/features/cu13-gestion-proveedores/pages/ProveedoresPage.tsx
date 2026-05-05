import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState, ConfirmDialog } from '../../../shared/components';
import { ProveedoresTable } from '../components/ProveedoresTable';
import { ProveedorFilters } from '../components/ProveedorFilters';
import { ValidarProveedorDialog } from '../components/ValidarProveedorDialog';
import { useProveedores } from '../hooks/useProveedores';
import { useEliminarProveedor } from '../hooks/useEliminarProveedor';
import type { ListarProveedoresParams } from '../types/proveedor.types';
import '../styles/proveedores.css';

export function ProveedoresPage() {
  const navigate = useNavigate();
  const { proveedores, loading, error, updateParams, refetch } = useProveedores();
  const { eliminarProveedor } = useEliminarProveedor();

  const [selectedProveedor, setSelectedProveedor] = useState<{ id: number; nombre: string } | null>(null);
  const [showValidateDialog, setShowValidateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSearch = (params: ListarProveedoresParams) => {
    updateParams(params);
  };

  const handleClear = () => {
    updateParams({});
  };

  const handleDelete = async () => {
    if (selectedProveedor) {
      try {
        await eliminarProveedor(selectedProveedor.id);
        refetch();
        setShowDeleteDialog(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="proveedores-page">
      <div className="page-header">
        <h1>Gestión de Proveedores</h1>
        <Button variant="primary" onClick={() => navigate('/proveedores/nuevo')}>
          Nuevo Proveedor
        </Button>
      </div>

      <ProveedorFilters onSearch={handleSearch} onClear={handleClear} />

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="error-card">
          <p>{error}</p>
          <Button onClick={refetch}>Reintentar</Button>
        </div>
      ) : proveedores.length === 0 ? (
        <EmptyState
          title="No hay proveedores"
          description="No se encontraron proveedores registrados. Comienza agregando uno."
          action={
            <Button variant="primary" onClick={() => navigate('/proveedores/nuevo')}>
              Registrar primer proveedor
            </Button>
          }
        />
      ) : (
        <ProveedoresTable
          proveedores={proveedores}
          onView={(id) => navigate(`/proveedores/${id}`)}
          onEdit={(id) => navigate(`/proveedores/${id}/editar`)}
          onDelete={(id) => {
            const p = proveedores.find(x => x.idProveedor === id);
            setSelectedProveedor({ id, nombre: p?.nombre || '' });
            setShowDeleteDialog(true);
          }}
          onValidar={(id) => {
            const p = proveedores.find(x => x.idProveedor === id);
            setSelectedProveedor({ id, nombre: p?.nombre || '' });
            setShowValidateDialog(true);
          }}
        />
      )}

      {showValidateDialog && selectedProveedor && (
        <ValidarProveedorDialog
          idProveedor={selectedProveedor.id}
          nombreProveedor={selectedProveedor.nombre}
          onClose={() => setShowValidateDialog(false)}
        />
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        title="Eliminar Proveedor"
        message={`¿Estás seguro de que deseas eliminar al proveedor "${selectedProveedor?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
