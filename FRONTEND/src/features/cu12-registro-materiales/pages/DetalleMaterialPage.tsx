import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, Card } from '../../../shared/components';
import { MaterialDetailCard } from '../components/MaterialDetailCard';
import { ActualizarStockDialog } from '../components/ActualizarStockDialog';
import { VerificarDisponibilidadMaterialDialog } from '../components/VerificarDisponibilidadMaterialDialog';
import { useMaterial } from '../hooks/useMaterial';
import '../styles/materiales.css';

export function DetalleMaterialPage() {
  const { idMaterial } = useParams<{ idMaterial: string }>();
  const navigate = useNavigate();
  const id = Number(idMaterial);

  const { material, loading, error, refetch } = useMaterial(id);
  const [showStockDialog, setShowStockDialog] = useState(false);
  const [showDispDialog, setShowDispDialog] = useState(false);

  if (loading) return <Loader />;
  if (error || !material) return <div className="error-card"><p>{error || 'Material no encontrado'}</p></div>;

  return (
    <div className="detalle-page-container">
      <div className="page-header">
        <h1>Detalle de Material</h1>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => navigate('/materiales')}>Volver</Button>
          <Button variant="primary" onClick={() => navigate(`/materiales/${id}/editar`)}>Editar</Button>
        </div>
      </div>

      <div className="detalle-content">
        <MaterialDetailCard material={material} />

        <Card title="Acciones de Inventario" className="inventory-actions-card">
          <div className="inventory-actions">
            <Button onClick={() => setShowStockDialog(true)}>Actualizar Stock</Button>
            <Button onClick={() => setShowDispDialog(true)}>Verificar Disponibilidad</Button>
          </div>
        </Card>
      </div>

      {showStockDialog && (
        <ActualizarStockDialog
          idMaterial={id}
          nombreMaterial={material.nombre}
          onClose={() => setShowStockDialog(false)}
          onSuccess={refetch}
        />
      )}

      {showDispDialog && (
        <VerificarDisponibilidadMaterialDialog
          idMaterial={id}
          nombreMaterial={material.nombre}
          onClose={() => setShowDispDialog(false)}
        />
      )}
    </div>
  );
}
