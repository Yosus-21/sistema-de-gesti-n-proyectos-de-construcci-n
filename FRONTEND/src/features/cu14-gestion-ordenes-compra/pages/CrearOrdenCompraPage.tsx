import { useNavigate } from 'react-router-dom';
import { OrdenCompraForm } from '../components/OrdenCompraForm';
import { useCrearOrdenCompra } from '../hooks/useCrearOrdenCompra';
import type { CrearOrdenCompraDto } from '../types/orden-compra.types';
import '../styles/ordenes-compra.css';

export function CrearOrdenCompraPage() {
  const navigate = useNavigate();
  const { crearOrden, loading, error } = useCrearOrdenCompra();

  const handleSubmit = async (data: CrearOrdenCompraDto) => {
    try {
      const result = await crearOrden(data);
      navigate(`/ordenes-compra/${result.idOrdenCompra}`);
    } catch (err) {
      console.error('Error al crear orden:', err);
    }
  };

  return (
    <div className="form-page-container">
      <div className="page-header">
        <h1>Crear Nueva Orden de Compra</h1>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <OrdenCompraForm
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={() => navigate('/ordenes-compra')}
      />
    </div>
  );
}
