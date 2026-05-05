import { useNavigate, useParams } from 'react-router-dom';
import { Button, Loader } from '../../../shared/components';
import { ClienteForm } from '../components/ClienteForm';
import { useCliente } from '../hooks/useCliente';
import { useActualizarCliente } from '../hooks/useActualizarCliente';
import type { ModificarClienteDto } from '../types/cliente.types';
import '../styles/clientes.css';

export function EditarClientePage() {
  const { idCliente } = useParams<{ idCliente: string }>();
  const id = idCliente ? Number(idCliente) : null;
  const navigate = useNavigate();

  const { cliente, loading: loadingCliente, error: loadError } = useCliente(id);
  const { actualizarCliente, loading: saving, error: saveError } = useActualizarCliente();

  const handleSubmit = async (data: ModificarClienteDto) => {
    if (!id) return;
    try {
      await actualizarCliente(id, data);
      navigate(`/clientes/${id}`);
    } catch {
      // error shown via hook state
    }
  };

  if (loadingCliente) return <Loader text="Cargando cliente..." />;
  if (loadError) return <div className="feedback-banner error">{loadError}</div>;
  if (!cliente) return null;

  return (
    <div>
      <div className="page-header">
        <h1>Editar cliente</h1>
        <Button variant="ghost" onClick={() => navigate(`/clientes/${id}`)}>
          ← Volver
        </Button>
      </div>

      {saveError && <div className="feedback-banner error">{saveError}</div>}

      <ClienteForm
        initialValues={{
          nombre: cliente.nombre,
          correo: cliente.correo,
          telefono: cliente.telefono,
          direccion: cliente.direccion,
          tipoCliente: cliente.tipoCliente,
        }}
        submitLabel="Guardar cambios"
        loading={saving}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
