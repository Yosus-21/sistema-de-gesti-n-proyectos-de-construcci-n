import { Card, Badge } from '../../../shared/components';
import type { ContratoContratista } from '../types/contrato-contratista.types';

interface ContratoContratistaDetailCardProps {
  contrato: ContratoContratista;
}

export function ContratoContratistaDetailCard({ contrato }: ContratoContratistaDetailCardProps) {
  const getBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'VIGENTE': return 'success';
      case 'FINALIZADO': return 'neutral';
      case 'CANCELADO': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <div className="contrato-detail-container">
      <Card title={`Contrato #${contrato.idContrato}`}>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Proyecto:</label>
            <p>{contrato.proyecto?.nombre || `P-${contrato.idProyecto}`}</p>
          </div>
          <div className="detail-item">
            <label>Contratista:</label>
            <p>{contrato.contratista?.nombreEmpresa || `C-${contrato.idContratista}`}</p>
          </div>
          <div className="detail-item">
            <label>Vigencia:</label>
            <p>{new Date(contrato.fechaInicio).toLocaleDateString()} - {new Date(contrato.fechaFin).toLocaleDateString()}</p>
          </div>
          <div className="detail-item">
            <label>Costo Total:</label>
            <p className="price-text">${contrato.costoTotal.toLocaleString()}</p>
          </div>
          <div className="detail-item">
            <label>Estado:</label>
            <Badge variant={getBadgeVariant(contrato.estadoContrato)}>{contrato.estadoContrato}</Badge>
          </div>
        </div>

        {contrato.descripcion && (
          <div className="detail-section">
            <label>Descripción:</label>
            <p>{contrato.descripcion}</p>
          </div>
        )}

        {contrato.condiciones && (
          <div className="detail-section">
            <label>Condiciones:</label>
            <p>{contrato.condiciones}</p>
          </div>
        )}
      </Card>

      <Card title="Detalles del Contrato">
        {contrato.detalles && contrato.detalles.length > 0 ? (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Costo Unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {contrato.detalles.map((d, index) => (
                  <tr key={d.idContratoDetalle || index}>
                    <td>{d.descripcion}</td>
                    <td>{d.cantidad || d.cantidadPersonas || 0}</td>
                    <td>${(d.costoUnitario || d.costoUnitarioPorDia || 0).toLocaleString()}</td>
                    <td>${(d.subtotal || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total:</td>
                  <td style={{ fontWeight: 'bold' }}>${contrato.costoTotal.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="empty-text">No hay detalles registrados en este contrato.</p>
        )}
      </Card>
    </div>
  );
}
