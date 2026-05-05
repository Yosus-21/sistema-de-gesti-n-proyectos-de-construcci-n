import { Card, Badge } from '../../../shared/components';
import type { Cliente } from '../types/cliente.types';

interface ClienteDetailCardProps {
  cliente: Cliente;
}

function DetailRow({ label, value }: { label: string; value?: string | boolean | null }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value !== undefined && value !== null && value !== '' ? String(value) : '—'}</span>
    </div>
  );
}

export function ClienteDetailCard({ cliente }: ClienteDetailCardProps) {
  return (
    <Card title={cliente.nombre} subtitle={`ID: ${cliente.idCliente}`}>
      <div className="detail-grid">
        <DetailRow label="Correo" value={cliente.correo} />
        <DetailRow label="Teléfono" value={cliente.telefono} />
        <DetailRow label="Dirección" value={cliente.direccion} />
        <DetailRow label="Tipo de cliente" value={cliente.tipoCliente} />
        <div className="detail-row">
          <span className="detail-label">Estado</span>
          <span className="detail-value">
            {cliente.activo !== false ? (
              <Badge variant="success">Activo</Badge>
            ) : (
              <Badge variant="neutral">Inactivo</Badge>
            )}
          </span>
        </div>
        {cliente.fechaRegistro && (
          <DetailRow
            label="Fecha de registro"
            value={new Date(cliente.fechaRegistro).toLocaleDateString('es-VE')}
          />
        )}
      </div>
    </Card>
  );
}
