import { useNavigate } from 'react-router-dom';
import { EntregaMaterialForm } from '../components/EntregaMaterialForm';
import { useRegistrarEntregaMaterial } from '../hooks/useRegistrarEntregaMaterial';
import type { RegistrarEntregaMaterialDto } from '../types/entrega-material.types';
import '../styles/entregas-materiales.css';

export function RegistrarEntregaMaterialPage() {
  const navigate = useNavigate();
  const { registrarEntrega, loading, error } = useRegistrarEntregaMaterial();

  const handleSubmit = async (data: RegistrarEntregaMaterialDto) => {
    try {
      const result = await registrarEntrega(data);
      navigate(`/entregas-materiales/${result.idEntregaMaterial}`);
    } catch (err) {
      console.error('Error al registrar entrega:', err);
    }
  };

  return (
    <div className="form-page-container">
      <div className="page-header">
        <h1>Registrar Nueva Entrega de Material</h1>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <EntregaMaterialForm
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={() => navigate('/entregas-materiales')}
      />
    </div>
  );
}
