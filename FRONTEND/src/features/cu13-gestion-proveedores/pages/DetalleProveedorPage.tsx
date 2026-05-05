import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader, Card } from '../../../shared/components';
import { ProveedorDetailCard } from '../components/ProveedorDetailCard';
import { ValidarProveedorDialog } from '../components/ValidarProveedorDialog';
import { useProveedor } from '../hooks/useProveedor';
import '../styles/proveedores.css';

export function DetalleProveedorPage() {
  const { idProveedor } = useParams<{ idProveedor: string }>();
  const navigate = useNavigate();
  const id = Number(idProveedor);

  const { proveedor, loading, error } = useProveedor(id);
  const [showValidateDialog, setShowValidateDialog] = useState(false);

  if (loading) return <Loader />;
  if (error || !proveedor) return <div className="error-card"><p>{error || 'Proveedor no encontrado'}</p></div>;

  return (
    <div className="detalle-page-container">
      <div className="page-header">
        <h1>Detalle de Proveedor</h1>
        <div className="header-actions">
          <Button variant="ghost" onClick={() => navigate('/proveedores')}>Volver</Button>
          <Button variant="primary" onClick={() => navigate(`/proveedores/${id}/editar`)}>Editar</Button>
        </div>
      </div>

      <div className="detalle-content">
        <ProveedorDetailCard proveedor={proveedor} />

        <Card title="Acciones de Proveedor" className="provider-actions-card">
          <div className="provider-actions">
            <Button onClick={() => setShowValidateDialog(true)}>Validar Proveedor</Button>
          </div>
        </Card>
      </div>

      {showValidateDialog && (
        <ValidarProveedorDialog
          idProveedor={id}
          nombreProveedor={proveedor.nombre}
          onClose={() => setShowValidateDialog(false)}
        />
      )}
    </div>
  );
}
