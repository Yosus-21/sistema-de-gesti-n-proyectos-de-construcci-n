import { useParams, useNavigate } from 'react-router-dom';
import { OrdenCompraForm } from '../components/OrdenCompraForm';
import { useOrdenCompra } from '../hooks/useOrdenCompra';
import { useActualizarOrdenCompra } from '../hooks/useActualizarOrdenCompra';
import { Loader } from '../../../shared/components';
import type { ModificarOrdenCompraDto } from '../types/orden-compra.types';
import '../styles/ordenes-compra.css';

export function EditarOrdenCompraPage() {
  const { idOrdenCompra } = useParams<{ idOrdenCompra: string }>();
  const navigate = useNavigate();
  const id = Number(idOrdenCompra);

  const { orden, loading: loadingData, error: errorData } = useOrdenCompra(id);
  const { actualizarOrden, loading: updating, error: errorUpdate } = useActualizarOrdenCompra();

  const handleSubmit = async (data: ModificarOrdenCompraDto) => {
    try {
      await actualizarOrden(id, data);
      navigate(`/ordenes-compra/${id}`);
    } catch (err) {
      console.error('Error al actualizar orden:', err);
    }
  };

  if (loadingData) return <Loader />;
  if (errorData || !orden) return <div className="error-card"><p>{errorData || 'Orden no encontrada'}</p></div>;

  return (
    <div className="form-page-container">
      <div className="page-header">
        <h1>Editar Orden de Compra #{id}</h1>
      </div>

      {errorUpdate && (
        <div className="error-banner">
          <p>{errorUpdate}</p>
        </div>
      )}

      <OrdenCompraForm
        initialData={orden}
        onSubmit={handleSubmit}
        loading={updating}
        onCancel={() => navigate(`/ordenes-compra/${id}`)}
      />
    </div>
  );
}
