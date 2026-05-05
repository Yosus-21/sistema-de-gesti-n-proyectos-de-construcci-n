import { Card, Badge } from '../../../shared/components';
import type { PronosticoMaterialIa } from '../types/pronostico-material-ia.types';

interface PronosticoMaterialIaDetailCardProps {
  pronostico: PronosticoMaterialIa;
}

export function PronosticoMaterialIaDetailCard({ pronostico }: PronosticoMaterialIaDetailCardProps) {
  const conf = pronostico.nivelConfianza || 0;
  const confVariant = conf >= 80 ? 'success' : conf >= 50 ? 'warning' : 'danger';

  return (
    <div className="detail-grid">
      <Card title="Detalle del Pronóstico">
        <div className="detail-info">
          <div className="info-item">
            <span className="label">ID Pronóstico:</span>
            <span className="value">{pronostico.idPronosticoMaterial}</span>
          </div>
          <div className="info-item">
            <span className="label">Proyecto:</span>
            <span className="value">{pronostico.proyecto?.nombre || `ID: ${pronostico.idProyecto}`}</span>
          </div>
          <div className="info-item">
            <span className="label">Material:</span>
            <span className="value">{pronostico.material?.nombre || `ID: ${pronostico.idMaterial}`}</span>
          </div>
          <div className="info-item">
            <span className="label">Stock Mínimo:</span>
            <span className="value">{pronostico.stockMinimo} {pronostico.material?.unidadMedida}</span>
          </div>
          <div className="info-item">
            <span className="label">Stock Máximo:</span>
            <span className="value">{pronostico.stockMaximo} {pronostico.material?.unidadMedida}</span>
          </div>
        </div>
      </Card>

      <Card title="Análisis de Confianza IA">
        <div className="detail-info">
          <div className="info-item">
            <span className="label">Nivel de Confianza:</span>
            <span className="value">
              <Badge variant={confVariant}>{conf}%</Badge>
            </span>
          </div>
          <div className="info-item">
            <span className="label">Fecha Generación:</span>
            <span className="value">{pronostico.fechaGeneracion ? new Date(pronostico.fechaGeneracion).toLocaleString() : '-'}</span>
          </div>
          <div className="info-item full">
            <span className="label">Observaciones del Modelo:</span>
            <p className="description-text">{pronostico.observaciones || 'No hay observaciones adicionales para este pronóstico.'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
