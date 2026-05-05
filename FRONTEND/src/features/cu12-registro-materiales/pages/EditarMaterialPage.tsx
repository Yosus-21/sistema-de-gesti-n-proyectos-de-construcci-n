import { useParams, useNavigate } from 'react-router-dom';
import { MaterialForm } from '../components/MaterialForm';
import { useMaterial } from '../hooks/useMaterial';
import { useActualizarMaterial } from '../hooks/useActualizarMaterial';
import { Loader } from '../../../shared/components';
import type { ModificarMaterialDto } from '../types/material.types';
import '../styles/materiales.css';

export function EditarMaterialPage() {
  const { idMaterial } = useParams<{ idMaterial: string }>();
  const navigate = useNavigate();
  const id = Number(idMaterial);

  const { material, loading: loadingData, error: errorData } = useMaterial(id);
  const { actualizarMaterial, loading: updating, error: errorUpdate } = useActualizarMaterial();

  const handleSubmit = async (data: ModificarMaterialDto) => {
    try {
      await actualizarMaterial(id, data);
      navigate(`/materiales/${id}`);
    } catch (err) {
      console.error('Error al actualizar material:', err);
    }
  };

  if (loadingData) return <Loader />;
  if (errorData || !material) return <div className="error-card"><p>{errorData || 'Material no encontrado'}</p></div>;

  return (
    <div className="form-page-container">
      <div className="page-header">
        <h1>Editar Material: {material.nombre}</h1>
      </div>

      {errorUpdate && (
        <div className="error-banner">
          <p>{errorUpdate}</p>
        </div>
      )}

      <MaterialForm
        initialData={material}
        onSubmit={handleSubmit}
        loading={updating}
        onCancel={() => navigate(`/materiales/${id}`)}
      />
    </div>
  );
}
