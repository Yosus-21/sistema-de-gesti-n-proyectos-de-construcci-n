import { useNavigate } from 'react-router-dom';
import { ContratoContratistaForm } from '../components/ContratoContratistaForm';
import { useCrearContratoContratista } from '../hooks/useCrearContratoContratista';
import type { RegistrarContratoContratistaDto } from '../types/contrato-contratista.types';
import '../styles/contratos-contratista.css';

export function RegistrarContratoContratistaPage() {
  const navigate = useNavigate();
  const { crearContrato, loading, error } = useCrearContratoContratista();

  const handleSubmit = async (data: RegistrarContratoContratistaDto) => {
    try {
      await crearContrato(data);
      navigate('/contratos');
    } catch (err) {
      console.error('Error al crear contrato:', err);
    }
  };

  return (
    <div className="form-page-container">
      <div className="page-header">
        <h1>Registrar Nuevo Contrato</h1>
      </div>

      {error && (
        <div className="error-banner">
          <p>{error}</p>
        </div>
      )}

      <ContratoContratistaForm
        onSubmit={handleSubmit}
        loading={loading}
        onCancel={() => navigate('/contratos')}
      />
    </div>
  );
}
