import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components';
import { ClienteForm } from '../components/ClienteForm';
import { useCrearCliente } from '../hooks/useCrearCliente';
import type { RegistrarClienteDto } from '../types/cliente.types';
import '../styles/clientes.css';

export function RegistrarClientePage() {
  const navigate = useNavigate();
  const { crearCliente, loading, error } = useCrearCliente();

  const handleSubmit = async (data: RegistrarClienteDto) => {
    try {
      await crearCliente(data);
      navigate('/clientes');
    } catch {
      // error is shown via hook state
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Nuevo cliente</h1>
        <Button variant="ghost" onClick={() => navigate('/clientes')}>
          ← Volver
        </Button>
      </div>

      {error && <div className="feedback-banner error">{error}</div>}

      <ClienteForm
        submitLabel="Registrar cliente"
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
