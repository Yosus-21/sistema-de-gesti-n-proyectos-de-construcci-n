import { Card, Badge } from '../../../shared/components';
import type { Reporte } from '../types/reporte.types';

interface ReporteDetailCardProps {
  reporte: Reporte;
}

export function ReporteDetailCard({ reporte }: ReporteDetailCardProps) {
  return (
    <div className="detail-grid">
      <Card title="Información del Reporte">
        <div className="detail-info">
          <div className="info-item">
            <span className="label">ID:</span>
            <span className="value">{reporte.idReporte}</span>
          </div>
          <div className="info-item">
            <span className="label">Tipo:</span>
            <span className="value">{reporte.tipoReporte}</span>
          </div>
          <div className="info-item">
            <span className="label">Proyecto:</span>
            <span className="value">{reporte.proyecto?.nombre || (reporte.idProyecto ? `Proyecto #${reporte.idProyecto}` : 'General')}</span>
          </div>
          <div className="info-item">
            <span className="label">Fecha Generación:</span>
            <span className="value">{reporte.fechaGeneracion ? new Date(reporte.fechaGeneracion).toLocaleString() : '-'}</span>
          </div>
        </div>
      </Card>

      <Card title="Período y Avance">
        <div className="detail-info">
          <div className="info-item">
            <span className="label">Desde:</span>
            <span className="value">{reporte.fechaInicioPeriodo ? new Date(reporte.fechaInicioPeriodo).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="label">Hasta:</span>
            <span className="value">{reporte.fechaFinPeriodo ? new Date(reporte.fechaFinPeriodo).toLocaleDateString() : 'N/A'}</span>
          </div>
          <div className="info-item">
            <span className="label">Avance General:</span>
            <span className="value">{reporte.porcentajeAvanceGeneral !== undefined ? `${reporte.porcentajeAvanceGeneral}%` : '-'}</span>
          </div>
        </div>
      </Card>

      <Card title="Ubicación de Archivo" className="full-width-card">
        <div className="detail-info">
          <div className="info-item full">
            <span className="label">Ruta PDF:</span>
            {reporte.rutaArchivoPdf ? (
              <code className="path-code">{reporte.rutaArchivoPdf}</code>
            ) : (
              <Badge variant="neutral">NO GENERADO</Badge>
            )}
          </div>
          <p className="note-text" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
            Nota: Use esta ruta como referencia del archivo generado en el servidor.
          </p>
        </div>
      </Card>

      {reporte.contenidoResumen && (
        <Card title="Resumen Ejecutivo" className="full-width-card">
          <p className="description-text">{reporte.contenidoResumen}</p>
        </Card>
      )}
    </div>
  );
}
