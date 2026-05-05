import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loader, EmptyState, ConfirmDialog, Can } from '../../../shared/components';
import { Role } from '../../../shared/types/roles.types';
import { MaterialesTable } from '../components/MaterialesTable';
import { MaterialFilters } from '../components/MaterialFilters';
import { ActualizarStockDialog } from '../components/ActualizarStockDialog';
import { VerificarDisponibilidadMaterialDialog } from '../components/VerificarDisponibilidadMaterialDialog';
import { useMateriales } from '../hooks/useMateriales';
import { useEliminarMaterial } from '../hooks/useEliminarMaterial';
import type { ListarMaterialesParams } from '../types/material.types';
import '../styles/materiales.css';

export function MaterialesPage() {
  const navigate = useNavigate();
  const { materiales, loading, error, updateParams, refetch } = useMateriales();
  const { eliminarMaterial } = useEliminarMaterial();

  const [selectedMaterial, setSelectedMaterial] = useState<{ id: number; nombre: string } | null>(null);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [showDispDialog, setShowDispDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const writeRoles = [Role.ADMIN, Role.GESTOR_PROYECTO, Role.ENCARGADO_COMPRAS];

  const handleSearch = (params: ListarMaterialesParams) => {
    updateParams(params);
  };

  const handleClear = () => {
    updateParams({});
  };

  const handleDelete = async () => {
    if (selectedMaterial) {
      try {
        await eliminarMaterial(selectedMaterial.id);
        refetch();
        setShowDeleteDialog(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="materiales-page">
      <div className="page-header">
        <h1>Registro de Materiales</h1>
        <Can roles={writeRoles}>
          <Button variant="primary" onClick={() => navigate('/materiales/nuevo')}>
            Nuevo Material
          </Button>
        </Can>
      </div>

      <MaterialFilters onSearch={handleSearch} onClear={handleClear} />

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="error-card">
          <p>{error}</p>
          <Button onClick={refetch}>Reintentar</Button>
        </div>
      ) : materiales.length === 0 ? (
        <EmptyState
          title="No hay materiales"
          description="No se encontraron materiales registrados. Comienza agregando uno."
          action={
            <Can roles={writeRoles}>
              <Button variant="primary" onClick={() => navigate('/materiales/nuevo')}>
                Registrar primer material
              </Button>
            </Can>
          }
        />
      ) : (
        <MaterialesTable
          materiales={materiales}
          onView={(id) => navigate(`/materiales/${id}`)}
          onEdit={(id) => navigate(`/materiales/${id}/editar`)}
          onDelete={(id) => {
            const m = materiales.find(x => x.idMaterial === id);
            setSelectedMaterial({ id, nombre: m?.nombre || '' });
            setShowDeleteDialog(true);
          }}
          onActualizarStock={(id) => {
            const m = materiales.find(x => x.idMaterial === id);
            setSelectedMaterial({ id, nombre: m?.nombre || '' });
            setShowStockDialog(true);
          }}
          onVerificarDisponibilidad={(id) => {
            const m = materiales.find(x => x.idMaterial === id);
            setSelectedMaterial({ id, nombre: m?.nombre || '' });
            setShowDispDialog(true);
          }}
        />
      )}

      {showStockDialog && selectedMaterial && (
        <ActualizarStockDialog
          idMaterial={selectedMaterial.id}
          nombreMaterial={selectedMaterial.nombre}
          onClose={() => setShowStockDialog(false)}
          onSuccess={refetch}
        />
      )}

      {showDispDialog && selectedMaterial && (
        <VerificarDisponibilidadMaterialDialog
          idMaterial={selectedMaterial.id}
          nombreMaterial={selectedMaterial.nombre}
          onClose={() => setShowDispDialog(false)}
        />
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        title="Eliminar Material"
        message={`¿Estás seguro de que deseas eliminar el material "${selectedMaterial?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
