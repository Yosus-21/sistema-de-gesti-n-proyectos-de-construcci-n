import { useNavigate } from 'react-router-dom';
import { MaterialForm } from '../components/MaterialForm';
import { useCrearMaterial } from '../hooks/useCrearMaterial';
import type { RegistrarMaterialDto } from '../types/material.types';
import '../styles/materiales.css';

export function RegistrarMaterialPage() {
  const navigate = useNavigate();
  const { crearMaterial, loading, error } = useCrearMaterial();

  const handleSubmit = async (data: RegistrarMaterialDto) => {
    try {
      await crearMaterial(data);
      navigate('/materiales');
    } catch (err) {
      console.error('Error al registrar material:', err);
    }
  };

  return (
    <div className="form-page-container">
      <div className="page-header">
        <h1>Registrar Nuevo Material</h1>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <MaterialForm
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={() => navigate('/materiales')}
      />
    </div>
  );
}
