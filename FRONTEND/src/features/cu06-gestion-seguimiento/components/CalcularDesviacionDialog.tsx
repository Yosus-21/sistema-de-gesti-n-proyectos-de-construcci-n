import { ConfirmDialog, Badge, Loader } from '../../../shared/components';
import { useCalcularDesviacion } from '../hooks/useCalcularDesviacion';
import { useEffect } from 'react';

interface CalcularDesviacionDialogProps {
  idTarea: number | null;
  nombreTarea?: string;
  onClose: () => void;
}

export function CalcularDesviacionDialog({ idTarea, nombreTarea, onClose }: CalcularDesviacionDialogProps) {
  const { calcularDesviacion, resultado, loading, error, limpiarResultado } = useCalcularDesviacion();

  useEffect(() => {
    if (idTarea) {
      calcularDesviacion(idTarea);
    }
  }, [idTarea, calcularDesviacion]);

  const handleClose = () => {
    limpiarResultado();
    onClose();
  };

  return (
    <ConfirmDialog
      open={!!idTarea}
      title="Cálculo de Desviación"
      onCancel={handleClose}
      onConfirm={handleClose}
      confirmText="Cerrar"
      showCancel={false}
    >
      <div style={{ minHeight: '100px' }}>
        {loading && <Loader text="Calculando desviación..." />}
        
        {error && (
          <div className="feedback-banner error">
            {error}
          </div>
        )}

        {resultado && (
          <div className="desviacion-result" style={{ textAlign: 'center', padding: '1rem' }}>
            <p style={{ marginBottom: '1rem' }}>
              Resultado para: <strong>{nombreTarea || `Tarea #${resultado.idTarea}`}</strong>
            </p>
            
            {resultado.atrasada ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <Badge variant="danger" className="badge-lg">ATRASADA</Badge>
                <p style={{ fontSize: '1.1rem' }}>
                  Desviación detectada: <span style={{ color: 'var(--color-danger)', fontWeight: 'bold' }}>{resultado.diasDesviacion} días</span>
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <Badge variant="success" className="badge-lg">AL DÍA</Badge>
                <p>La tarea se encuentra dentro del plazo planificado.</p>
                {resultado.diasDesviacion < 0 && (
                  <p>Adelanto de: <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>{Math.abs(resultado.diasDesviacion)} días</span></p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </ConfirmDialog>
  );
}
