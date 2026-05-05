import { useParams, useNavigate } from 'react-router-dom';
import { ProveedorForm } from '../components/ProveedorForm';
import { useProveedor } from '../hooks/useProveedor';
import { useActualizarProveedor } from '../hooks/useActualizarProveedor';
import { Loader } from '../../../shared/components';
import type { ModificarProveedorDto } from '../types/proveedor.types';
import '../styles/proveedores.css';

export function EditarProveedorPage() {
  const { idProveedor } = useParams<{ idProveedor: string }>();
  const navigate = useNavigate();
  const id = Number(idProveedor);

  const { proveedor, loading: loadingData, error: errorData } = useProveedor(id);
  const { actualizarProveedor, loading: updating, error: errorUpdate } = useActualizarProveedor();

  const handleSubmit = async (data: ModificarProveedorDto) => {
    try {
      await actualizarProveedor(id, data);
      navigate(`/proveedores/${id}`);
    } catch (err) {
      console.error('Error al actualizar proveedor:', err);
    }
  };

  if (loadingData) return <Loader />;
  if (errorData || !proveedor) return <div className="error-card"><p>{errorData || 'Proveedor no encontrado'}</p></div>;

  return (
    <div className="form-page-container">
      <div className="page-header">
        <h1>Editar Proveedor: {proveedor.nombre}</h1>
      </div>

      {errorUpdate && (
        <div className="error-banner">
          <p>{errorUpdate}</p>
        </div>
      )}

      <ProveedorForm
        initialData={proveedor}
        onSubmit={handleSubmit}
        loading={updating}
        onCancel={() => navigate(`/proveedores/${id}`)}
      />
    </div>
  );
}
