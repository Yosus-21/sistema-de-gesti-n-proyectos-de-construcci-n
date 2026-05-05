import { useNavigate } from 'react-router-dom';
import { ProveedorForm } from '../components/ProveedorForm';
import { useCrearProveedor } from '../hooks/useCrearProveedor';
import type { RegistrarProveedorDto } from '../types/proveedor.types';
import '../styles/proveedores.css';

export function RegistrarProveedorPage() {
  const navigate = useNavigate();
  const { crearProveedor, loading, error } = useCrearProveedor();

  const handleSubmit = async (data: RegistrarProveedorDto) => {
    try {
      await crearProveedor(data);
      navigate('/proveedores');
    } catch (err) {
      console.error('Error al registrar proveedor:', err);
    }
  };

  return (
    <div className="form-page-container">
      <div className="page-header">
        <h1>Registrar Nuevo Proveedor</h1>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <ProveedorForm
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={() => navigate('/proveedores')}
      />
    </div>
  );
}
