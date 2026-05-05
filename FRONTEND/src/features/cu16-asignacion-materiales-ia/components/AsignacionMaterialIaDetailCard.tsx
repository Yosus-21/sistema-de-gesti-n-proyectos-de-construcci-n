import { Card, Badge } from '../../../shared/components';
import type { AsignacionMaterialIa } from '../types/asignacion-material-ia.types';

interface AsignacionMaterialIaDetailCardProps {
  asignacion: AsignacionMaterialIa;
}

export function AsignacionMaterialIaDetailCard({ asignacion }: AsignacionMaterialIaDetailCardProps) {
  return (
    <div className="detail-grid">
      <Card title="Detalle de Asignación IA">
        <div className="detail-info">
          <div className="info-item">
            <span className="label">ID Asignación:</span>
            <span className="value">{asignacion.idAsignacionMaterial}</span>
          </div>
          <div className="info-item">
            <span className="label">Tarea ID:</span>
            <span className="value">{asignacion.idTarea}</span>
          </div>
          <div className="info-item">
            <span className="label">Material:</span>
            <span className="value">{asignacion.material?.nombre || `ID: ${asignacion.idMaterial}`}</span>
          </div>
          <div className="info-item">
            <span className="label">Cantidad Asignada:</span>
            <span className="value">{asignacion.cantidadAsignada?.toLocaleString()} {asignacion.material?.unidadMedida}</span>
          </div>
          <div className="info-item">
            <span className="label">Costo Estimado:</span>
            <span className="value">${asignacion.costoEstimado?.toLocaleString()}</span>
          </div>
          <div className="info-item">
            <span className="label">Estado:</span>
            <span className="value">
              <Badge variant={asignacion.estadoAsignacion === 'CONFIRMADA' ? 'success' : 'warning'}>
                {asignacion.estadoAsignacion}
              </Badge>
            </span>
          </div>
        </div>
      </Card>

      <Card title="Inteligencia Artificial & Restricciones">
        <div className="detail-info">
          <div className="info-item">
            <span className="label">Método Generación:</span>
            <span className="value">
              <Badge variant={asignacion.generadaPorIa ? 'info' : 'neutral'}>
                {asignacion.generadaPorIa ? 'Gemini AI' : 'Algoritmo Heurístico'}
              </Badge>
            </span>
          </div>
          <div className="info-item">
            <span className="label">Fecha Generación:</span>
            <span className="value">{asignacion.fechaGeneracion ? new Date(asignacion.fechaGeneracion).toLocaleString() : '-'}</span>
          </div>
          <div className="info-item full">
            <span className="label">Restricciones Aplicadas:</span>
            <p className="description-text">{asignacion.restricciones || 'Sin restricciones específicas.'}</p>
          </div>
          <div className="info-item full">
            <span className="label">Observaciones:</span>
            <p className="description-text">{asignacion.observaciones || 'Sin observaciones.'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
