import { useEffect } from 'react';
import { Card, Button, Loader, Badge } from '../../../shared/components';
import { useCalcularConfianzaPronostico } from '../hooks/useCalcularConfianzaPronostico';

interface CalcularConfianzaPronosticoDialogProps {
  idPronosticoMaterial: number;
  onClose: () => void;
}

export function CalcularConfianzaPronosticoDialog({ idPronosticoMaterial, onClose }: CalcularConfianzaPronosticoDialogProps) {
  const { calcularConfianza, loading, error, resultado } = useCalcularConfianzaPronostico();

  useEffect(() => {
    calcularConfianza(idPronosticoMaterial);
  }, [idPronosticoMaterial, calcularConfianza]);

  const getConfVariant = (val: number) => {
    if (val >= 80) return 'success';
    if (val >= 50) return 'warning';
    return 'danger';
  };

  return (
    <div className="modal-overlay">
      <Card className="modal-content" title="Análisis Detallado de Confianza">
        {loading ? (
          <div style={{ padding: '2rem' }}>
            <Loader />
            <p style={{ textAlign: 'center', marginTop: '1rem' }}>Analizando factores con IA...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : resultado ? (
          <div className="confidence-results">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: `var(--color-${getConfVariant(resultado.nivelConfianza)})` }}>
                {resultado.nivelConfianza}%
              </div>
              <Badge variant={getConfVariant(resultado.nivelConfianza)}>
                Confianza {resultado.nivelConfianza >= 80 ? 'Alta' : resultado.nivelConfianza >= 50 ? 'Media' : 'Baja'}
              </Badge>
            </div>

            <h4>Factores considerados:</h4>
            <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem' }}>
              {resultado.factores.map((f, i) => (
                <li key={i} style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{f}</li>
              ))}
            </ul>

            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
              Última actualización: {new Date(resultado.ultimaActualizacion).toLocaleString()}
            </div>
          </div>
        ) : null}

        <div className="modal-actions">
          <Button variant="primary" onClick={onClose}>Entendido</Button>
        </div>
      </Card>
    </div>
  );
}
