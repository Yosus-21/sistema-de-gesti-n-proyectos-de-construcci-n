import { Card, Badge } from '../../../shared/components';
import type { Material } from '../types/material.types';

interface MaterialDetailCardProps {
  material: Material;
}

export function MaterialDetailCard({ material }: MaterialDetailCardProps) {
  return (
    <Card title={material.nombre} className="material-detail-card">
      <div className="detail-grid">
        <div className="detail-item">
          <label>ID Material</label>
          <span>#{material.idMaterial}</span>
        </div>
        <div className="detail-item">
          <label>Tipo de Material</label>
          <Badge variant="info">{material.tipoMaterial || 'No especificado'}</Badge>
        </div>
        <div className="detail-item">
          <label>Estado</label>
          <Badge variant={material.activo ? 'success' : 'neutral'}>
            {material.activo ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
        <div className="detail-item">
          <label>Unidad de Medida</label>
          <span>{material.unidadMedida || 'N/A'}</span>
        </div>
        <div className="detail-item">
          <label>Cantidad Disponible</label>
          <span className={material.cantidadDisponible && material.stockMinimo && material.cantidadDisponible <= material.stockMinimo ? 'low-stock' : ''}>
            {material.cantidadDisponible}
          </span>
        </div>
        <div className="detail-item">
          <label>Stock Mínimo</label>
          <span>{material.stockMinimo}</span>
        </div>
        <div className="detail-item">
          <label>Costo Unitario</label>
          <span>${(material.costoUnitario || 0).toLocaleString()}</span>
        </div>
        <div className="detail-item">
          <label>Fecha de Registro</label>
          <span>{material.fechaRegistro ? new Date(material.fechaRegistro).toLocaleDateString() : 'N/A'}</span>
        </div>
      </div>
      
      <div className="detail-section">
        <label>Descripción</label>
        <p>{material.descripcion || 'Sin descripción disponible.'}</p>
      </div>
    </Card>
  );
}
