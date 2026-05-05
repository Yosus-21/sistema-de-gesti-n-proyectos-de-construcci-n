import { useState } from 'react';
import { Card, Button, Badge } from '../../../shared/components';
import { useExportarReportePdf } from '../hooks/useExportarReportePdf';
import type { ExportarReportePdfResponse } from '../types/reporte.types';

interface ExportarReportePdfDialogProps {
  idReporte: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExportarReportePdfDialog({ idReporte, isOpen, onClose, onSuccess }: ExportarReportePdfDialogProps) {
  const { exportarReportePdf, loading, error } = useExportarReportePdf();
  const [result, setResult] = useState<ExportarReportePdfResponse | null>(null);

  const handleConfirm = async () => {
    try {
      const res = await exportarReportePdf(idReporte);
      setResult(res);
    } catch (err) {
      console.error('Error exporting PDF:', err);
    }
  };

  const handleFinalize = () => {
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title={`Exportar Reporte #${idReporte} a PDF`}>
        {!result ? (
          <div>
            <div className="warning-banner" style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <p style={{ color: '#92400e', fontSize: '0.9rem' }}>
                <strong>Aviso:</strong> El servidor generará un archivo PDF físico basado en los datos actuales del reporte.
              </p>
            </div>
            
            <p className="modal-description">¿Desea proceder con la generación del documento?</p>

            {error && <p className="error-message">{error}</p>}

            <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
              <Button variant="primary" onClick={handleConfirm} loading={loading}>Generar PDF</Button>
            </div>
          </div>
        ) : (
          <div className="result-container">
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <Badge variant={result.generado ? 'success' : 'danger'}>
                {result.generado ? 'PDF GENERADO EXITOSAMENTE' : 'ERROR EN GENERACIÓN'}
              </Badge>
            </div>

            {result.rutaArchivoPdf && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>Ruta del archivo en el servidor:</p>
                <code className="path-code" style={{ display: 'block', padding: '0.5rem', background: '#f3f4f6', borderRadius: '4px', wordBreak: 'break-all', marginTop: '0.5rem' }}>
                  {result.rutaArchivoPdf}
                </code>
              </div>
            )}

            <p className="note-text" style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Nota: Si no existe endpoint de descarga, use esta ruta como referencia del archivo generado en el servidor.
            </p>

            <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" onClick={handleFinalize}>Cerrar</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
