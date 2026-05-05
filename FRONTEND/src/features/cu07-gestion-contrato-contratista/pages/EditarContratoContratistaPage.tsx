import { useParams, useNavigate } from 'react-router-dom';
import { ContratoContratistaForm } from '../components/ContratoContratistaForm';
import { useContratoContratista } from '../hooks/useContratoContratista';
import { useActualizarContratoContratista } from '../hooks/useActualizarContratoContratista';
import { Loader } from '../../../shared/components';
import type { ModificarContratoContratistaDto } from '../types/contrato-contratista.types';
import '../styles/contratos-contratista.css';

export function EditarContratoContratistaPage() {
  const { idContrato } = useParams<{ idContrato: string }>();
  const navigate = useNavigate();
  const id = Number(idContrato);

  const { contrato, loading: loadingData, error: errorData } = useContratoContratista(id);
  const { actualizarContrato, loading: updating, error: errorUpdate } = useActualizarContratoContratista();

  const handleSubmit = async (data: ModificarContratoContratistaDto) => {
    try {
      await actualizarContrato(id, data);
      navigate(`/contratos/${id}`);
    } catch (err) {
      console.error('Error al actualizar contrato:', err);
    }
  };

  if (loadingData) return <Loader />;
  if (errorData || !contrato) return <div className="error-card"><p>{errorData || 'Contrato no encontrado'}</p></div>;

  return (
    <div className="form-page-container">
      <div className="page-header">
        <h1>Editar Contrato #{id}</h1>
      </div>

      {errorUpdate && (
        <div className="error-banner">
          <p>{errorUpdate}</p>
        </div>
      )}

      <ContratoContratistaForm
        initialData={contrato}
        onSubmit={handleSubmit}
        loading={updating}
        onCancel={() => navigate(`/contratos/${id}`)}
      />
    </div>
  );
}
