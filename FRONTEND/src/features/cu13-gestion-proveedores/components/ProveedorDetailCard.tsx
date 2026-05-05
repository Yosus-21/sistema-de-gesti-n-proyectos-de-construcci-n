import { Card, Badge } from '../../../shared/components';
import type { Proveedor } from '../types/proveedor.types';

interface ProveedorDetailCardProps {
  proveedor: Proveedor;
}

export function ProveedorDetailCard({ proveedor }: ProveedorDetailCardProps) {
  return (
    <Card title={proveedor.nombre} className="proveedor-detail-card">
      <div className="detail-grid">
        <div className="detail-item">
          <label>ID Proveedor</label>
          <span>#{proveedor.idProveedor}</span>
        </div>
        <div className="detail-item">
          <label>NIT</label>
          <span>{proveedor.nit || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <label>Estado</label>
          <Badge variant={proveedor.activo ? 'success' : 'neutral'}>
            {proveedor.activo ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
        <div className="detail-item">
          <label>Correo</label>
          <span>{proveedor.correo || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <label>Teléfono</label>
          <span>{proveedor.telefono || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <label>Fecha de Registro</label>
          <span>{proveedor.fechaRegistro ? new Date(proveedor.fechaRegistro).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>
      
      <div className="detail-section">
        <label>Dirección</label>
        <p>{proveedor.direccion || 'No se proporcionó dirección.'}</p>
      </div>
    </Card>
  );
}
