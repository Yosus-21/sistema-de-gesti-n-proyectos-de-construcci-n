import { useState } from 'react';
import { Card, Button, Input, Select, Badge } from '../../../shared/components';
import { useGenerarNotificacion } from '../hooks/useGenerarNotificacion';
import type { GenerarNotificacionDto, GenerarNotificacionResponse, MetodoNotificacion } from '../types/alerta-notificacion.types';

interface GenerarNotificacionDialogProps {
  idAlerta: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultMessage?: string;
  defaultMethod?: MetodoNotificacion;
  defaultEmail?: string;
}

export function GenerarNotificacionDialog({ 
  idAlerta, 
  isOpen, 
  onClose, 
  onSuccess,
  defaultMessage = '',
  defaultMethod = 'SISTEMA',
  defaultEmail = ''
}: GenerarNotificacionDialogProps) {
  const { generarNotificacion, loading, error } = useGenerarNotificacion();
  const [formData, setFormData] = useState<GenerarNotificacionDto>({
    metodoNotificacion: defaultMethod,
    mensajeNotificacion: defaultMessage,
    correoDestino: defaultEmail,
  });
  const [result, setResult] = useState<GenerarNotificacionResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await generarNotificacion(idAlerta, formData);
      setResult(res);
      if (res.notificada) {
        // We keep the result visible for a moment or wait for user to close
      }
    } catch (err) {
      console.error('Error generating notification:', err);
    }
  };

  const handleFinalize = () => {
    onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title={`Generar Notificación para Alerta #${idAlerta}`}>
        {!result ? (
          <form onSubmit={handleSubmit}>
            <p className="modal-description">Configure los detalles del envío inmediato.</p>
            
            <div className="form-grid">
              <Select
                label="Método de Notificación"
                name="metodoNotificacion"
                value={formData.metodoNotificacion}
                onChange={handleChange}
                options={[
                  { value: 'SISTEMA', label: 'Sistema' },
                  { value: 'EMAIL', label: 'Email' },
                ]}
                required
              />
              {formData.metodoNotificacion === 'EMAIL' && (
                <Input
                  label="Correo Destino"
                  name="correoDestino"
                  type="email"
                  value={formData.correoDestino}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                />
              )}
            </div>

            <div className="form-full" style={{ marginTop: '1rem' }}>
              <Input
                label="Mensaje"
                name="mensajeNotificacion"
                value={formData.mensajeNotificacion}
                onChange={handleChange}
                required
              />
            </div>

            <p className="note-text" style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Nota: El envío real por email depende de la configuración SMTP del backend.
            </p>

            {error && <p className="error-message">{error}</p>}

            <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <Button variant="ghost" onClick={onClose} type="button">Cancelar</Button>
              <Button variant="primary" type="submit" loading={loading}>Enviar Notificación</Button>
            </div>
          </form>
        ) : (
          <div className="result-container">
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <Badge variant={result.notificada ? 'success' : 'danger'}>
                {result.notificada ? 'NOTIFICADA EXITOSAMENTE' : 'ERROR EN NOTIFICACIÓN'}
              </Badge>
            </div>

            {result.envioEmail && (
              <Card title="Resultado de Email">
                <div className="detail-info">
                  <div className="info-item">
                    <span className="label">Enviado:</span>
                    <span className="value">{result.envioEmail.sent ? 'SÍ' : 'NO'}</span>
                  </div>
                  {result.envioEmail.provider && (
                    <div className="info-item">
                      <span className="label">Proveedor:</span>
                      <span className="value">{result.envioEmail.provider}</span>
                    </div>
                  )}
                  {result.envioEmail.reason && (
                    <div className="info-item">
                      <span className="label">Motivo/Error:</span>
                      <span className="value">{result.envioEmail.reason}</span>
                    </div>
                  )}
                  {result.envioEmail.messageId && (
                    <div className="info-item">
                      <span className="label">ID Mensaje:</span>
                      <span className="value">{result.envioEmail.messageId}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <div className="modal-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary" onClick={handleFinalize}>Cerrar</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
