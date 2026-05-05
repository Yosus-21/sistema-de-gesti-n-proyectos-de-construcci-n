import { useNavigate, useParams } from 'react-router-dom';
import { Button, Loader } from '../../../shared/components';
import { ClienteDetailCard } from '../components/ClienteDetailCard';
import { useCliente } from '../hooks/useCliente';
import '../styles/clientes.css';

export function DetalleClientePage() {
  const { idCliente } = useParams<{ idCliente: string }>();
  const id = idCliente ? Number(idCliente) : null;
  const navigate = useNavigate();

  const { cliente, loading, error } = useCliente(id);

  if (loading) return <Loader text="Cargando cliente..." />;
  if (error) return <div className="feedback-banner error">{error}</div>;
  if (!cliente) return null;

  return (
    <div>
      <div className="page-header">
        <h1>Detalle del cliente</h1>
      </div>

      <div className="detail-actions">
        <Button variant="ghost" onClick={() => navigate('/clientes')}>
          ← Volver
        </Button>
        <Button onClick={() => navigate(`/clientes/${cliente.idCliente}/editar`)}>
          Editar cliente
        </Button>
      </div>

      <ClienteDetailCard cliente={cliente} />
    </div>
  );
}
